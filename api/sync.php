<?php
/**
 * VALKIRIA REST API - Endpoint de Producción Blindado
 * Endpoint: https://www.idep.gob.pe/seguimiento/api/sync.php
 * Ubicación en Servidor: C:\inetpub\wwwroot\seguimiento\api\sync.php
 *
 * Soporta:
 * - GET: Health check seguro (cero divulgación de información).
 * - POST normal / action=upsert: Inserción y actualización de reportes de campo.
 * - POST action=delete: Eliminación segura de reportes por ID.
 * - Persistencia fotográfica directa en base de datos (foto_base64 y foto_blob) + caché en disco.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -------------------------------------------------------------
// GET: Verificación de estado blindada (Sin divulgación de datos)
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    http_response_code(200);
    echo json_encode(array("status" => "ok"), JSON_UNESCAPED_UNICODE);
    exit;
}

// -------------------------------------------------------------
// POST / DELETE: Operaciones sobre reportes de campo
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!$payload || !is_array($payload)) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Petición no válida"), JSON_UNESCAPED_UNICODE);
        exit;
    }

    $id = isset($payload['id']) ? trim($payload['id']) : '';
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Identificador requerido"), JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Conexión segura a SQL Server SEGUIMIENTO en localhost
    $serverName = "localhost";
    $connectionOptions = array(
        "Database" => "SEGUIMIENTO",
        "Uid" => "sa",
        "PWD" => "Ign2015",
        "CharacterSet" => "UTF-8"
    );

    $conn = @sqlsrv_connect($serverName, $connectionOptions);
    if ($conn === false) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Error interno del servicio"), JSON_UNESCAPED_UNICODE);
        exit;
    }

    $action = isset($payload['action']) ? strtolower(trim($payload['action'])) : 'upsert';

    // -------------------------------------------------------------
    // ACCIÓN 1: ELIMINAR REPORTE (action == 'delete' o método DELETE)
    // -------------------------------------------------------------
    if ($action === 'delete' || $_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $sqlDelete = "DELETE FROM [dbo].[valkiria_reportes] WHERE id = ?";
        $stmtDel = @sqlsrv_query($conn, $sqlDelete, array($id));

        if ($stmtDel === false) {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al eliminar el reporte"), JSON_UNESCAPED_UNICODE);
            @sqlsrv_close($conn);
            exit;
        }

        // Eliminar también caché de foto en disco si existe
        $cachedPhoto = __DIR__ . '/fotos/' . $id . '.jpg';
        if (file_exists($cachedPhoto)) {
            @unlink($cachedPhoto);
        }

        @sqlsrv_close($conn);
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "id" => $id,
            "message" => "Reporte eliminado correctamente."
        ), JSON_UNESCAPED_UNICODE);
        exit;
    }

    // -------------------------------------------------------------
    // ACCIÓN 2: GUARDAR / EDITAR REPORTE (UPSERT)
    // -------------------------------------------------------------
    $jefeTob     = isset($payload['jefe_tob']) ? trim($payload['jefe_tob']) : '';
    $telefono    = isset($payload['telefono']) ? trim($payload['telefono']) : '';
    $lugarMision = isset($payload['lugar_mision']) ? trim($payload['lugar_mision']) : '';
    $personal    = isset($payload['personal']) ? trim($payload['personal']) : (isset($payload['persona']) ? trim($payload['persona']) : '');
    $maquinaria  = isset($payload['maquinaria']) ? trim($payload['maquinaria']) : '';
    $ocurrencias = isset($payload['ocurrencias']) ? trim($payload['ocurrencias']) : '';
    
    // Coordenadas
    $coords      = isset($payload['coordenadas']) ? $payload['coordenadas'] : array();
    $latitud     = isset($coords['lat']) ? floatval($coords['lat']) : (isset($payload['latitude']) ? floatval($payload['latitude']) : 0.0);
    $longitud    = isset($coords['lon']) ? floatval($coords['lon']) : (isset($payload['longitude']) ? floatval($payload['longitude']) : 0.0);
    $altitud     = isset($coords['altitud']) ? floatval($coords['altitud']) : 0.0;
    $precisionM  = isset($coords['precision_m']) ? floatval($coords['precision_m']) : 0.0;
    $dms         = isset($coords['dms']) ? trim($coords['dms']) : '';
    $ipOrigen    = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';

    // Procesamiento fotográfico: Guardar tanto en SQL Server como en disco si es posible
    $fotoPath = null;
    $fotoBase64 = null;
    $fotoBlob = null;

    if (!empty($payload['foto_base64'])) {
        $fotoBase64 = trim($payload['foto_base64']);
        $bytes = base64_decode($fotoBase64);
        if ($bytes !== false) {
            $fotoBlob = $bytes;
            $fotoPath = 'foto.php?id=' . $id;

            // Intentar escribir en disco como acelerador de caché
            $dirFotos = __DIR__ . '/fotos/';
            if (!is_dir($dirFotos)) {
                @mkdir($dirFotos, 0777, true);
            }
            @file_put_contents($dirFotos . $id . '.jpg', $bytes);
        }
    } elseif (!empty($payload['foto_path'])) {
        $fotoPath = trim($payload['foto_path']);
    }

    // MERGE atómico en SQL Server: Soporta inserción y actualización
    $sqlMerge = "
        MERGE INTO [dbo].[valkiria_reportes] AS target
        USING (SELECT ? AS id) AS source
        ON (target.id = source.id)
        WHEN MATCHED THEN
            UPDATE SET 
                jefe_tob = ?,
                telefono = ?,
                lugar_mision = ?,
                personal = ?,
                maquinaria = ?,
                ocurrencias = ?,
                latitud = CASE WHEN ? <> 0 THEN ? ELSE target.latitud END,
                longitud = CASE WHEN ? <> 0 THEN ? ELSE target.longitud END,
                altitud = CASE WHEN ? <> 0 THEN ? ELSE target.altitud END,
                precision_m = CASE WHEN ? <> 0 THEN ? ELSE target.precision_m END,
                dms = COALESCE(NULLIF(?, ''), target.dms),
                foto_path = COALESCE(?, target.foto_path),
                foto_base64 = COALESCE(?, target.foto_base64),
                foto_blob = COALESCE(?, target.foto_blob),
                ip_origen = ?
        WHEN NOT MATCHED THEN
            INSERT (id, jefe_tob, telefono, lugar_mision, personal, maquinaria, ocurrencias, latitud, longitud, altitud, precision_m, dms, foto_path, foto_base64, foto_blob, fecha_registro, ip_origen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATETIME(), ?);
    ";

    $params = array(
        // UPDATE params
        $id,
        $jefeTob, $telefono, $lugarMision, $personal, $maquinaria, $ocurrencias,
        $latitud, $latitud,
        $longitud, $longitud,
        $altitud, $altitud,
        $precisionM, $precisionM,
        $dms,
        $fotoPath,
        $fotoBase64,
        $fotoBlob,
        $ipOrigen,

        // INSERT params
        $id,
        $jefeTob, $telefono, $lugarMision, $personal, $maquinaria, $ocurrencias,
        $latitud, $longitud, $altitud, $precisionM, $dms,
        $fotoPath, $fotoBase64, $fotoBlob,
        $ipOrigen
    );

    $stmt = @sqlsrv_query($conn, $sqlMerge, $params);
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Error al persistir reporte"
        ), JSON_UNESCAPED_UNICODE);
        @sqlsrv_close($conn);
        exit;
    }

    @sqlsrv_close($conn);

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "id" => $id,
        "message" => "Reporte registrado correctamente."
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(array("error" => "Método no permitido"), JSON_UNESCAPED_UNICODE);
