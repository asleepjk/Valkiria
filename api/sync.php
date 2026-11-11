<?php
/**
 * VALKIRIA REST API - Endpoint de Producción Blindado
 * Endpoint: https://www.idep.gob.pe/seguimiento/api/sync.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
    echo json_encode(array(
        "status" => "ok"
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

// -------------------------------------------------------------
// POST: Recepción de nuevo reporte de campo desde el APK móvil
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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

    // Conexión segura a SQL Server SEGUIMIENTO
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
        echo json_encode(array(
            "success" => false,
            "message" => "Error interno del servicio"
        ), JSON_UNESCAPED_UNICODE);
        exit;
    }

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

    // 1. Guardar Evidencia Fotográfica en disco
    $fotoPath = null;
    if (!empty($payload['foto_base64'])) {
        $fotoBytes = base64_decode($payload['foto_base64']);
        if ($fotoBytes !== false) {
            $fotoFilename = $id . '.jpg';
            $dirFotos = __DIR__ . '/fotos/';
            if (!is_dir($dirFotos)) {
                @mkdir($dirFotos, 0777, true);
            }
            $destFile = $dirFotos . $fotoFilename;
            @file_put_contents($destFile, $fotoBytes);
            $fotoPath = 'fotos/' . $fotoFilename;
        }
    } elseif (!empty($payload['foto_path'])) {
        $fotoPath = trim($payload['foto_path']);
    }

    // 2. Insertar o Actualizar en SQL Server (MERGE atómico e idempotente)
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
                latitud = ?,
                longitud = ?,
                altitud = ?,
                precision_m = ?,
                dms = ?,
                foto_path = COALESCE(?, target.foto_path),
                ip_origen = ?
        WHEN NOT MATCHED THEN
            INSERT (id, jefe_tob, telefono, lugar_mision, personal, maquinaria, ocurrencias, latitud, longitud, altitud, precision_m, dms, foto_path, fecha_registro, ip_origen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATETIME(), ?);
    ";

    $params = array(
        // Parámetros para UPDATE
        $id, $jefeTob, $telefono, $lugarMision, $personal, $maquinaria, $ocurrencias,
        $latitud, $longitud, $altitud, $precisionM, $dms, $fotoPath, $ipOrigen,
        // Parámetros para INSERT
        $id, $jefeTob, $telefono, $lugarMision, $personal, $maquinaria, $ocurrencias,
        $latitud, $longitud, $altitud, $precisionM, $dms, $fotoPath, $ipOrigen
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
