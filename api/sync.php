<?php
/**
 * VALKIRIA REST API - Endpoint de Producción Blindado
 * Endpoint: https://www.idep.gob.pe/seguimiento/api/sync.php
 * Ubicación en Servidor: C:\inetpub\wwwroot\seguimiento\api\sync.php
 *
 * Operaciones:
 * - GET: Health check seguro (status: ok).
 * - POST action=update / edit: Actualización directa de los 6 campos del reporte.
 * - POST action=delete / DELETE: Eliminación segura del reporte por ID.
 * - POST action=upsert (por defecto): Sincronización completa de nuevo punto / actualización APK.
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
    // ACCIÓN 2: ACTUALIZAR REPORTE EXISTENTE (action == 'update' / 'edit')
    // -------------------------------------------------------------
    if ($action === 'update' || $action === 'edit') {
        $jefeTob     = isset($payload['jefe_tob']) ? trim($payload['jefe_tob']) : '';
        $telefono    = isset($payload['telefono']) ? trim($payload['telefono']) : '';
        $lugarMision = isset($payload['lugar_mision']) ? trim($payload['lugar_mision']) : '';
        $personal    = isset($payload['personal']) ? trim($payload['personal']) : (isset($payload['persona']) ? trim($payload['persona']) : '');
        $maquinaria  = isset($payload['maquinaria']) ? trim($payload['maquinaria']) : '';
        $ocurrencias = isset($payload['ocurrencias']) ? trim($payload['ocurrencias']) : '';

        $sqlUpdate = "UPDATE [dbo].[valkiria_reportes] 
                      SET jefe_tob = ?, 
                          telefono = ?, 
                          lugar_mision = ?, 
                          personal = ?, 
                          maquinaria = ?, 
                          ocurrencias = ? 
                      WHERE id = ?";

        $paramsUpdate = array($jefeTob, $telefono, $lugarMision, $personal, $maquinaria, $ocurrencias, $id);
        $stmtUpd = @sqlsrv_query($conn, $sqlUpdate, $paramsUpdate);

        if ($stmtUpd === false) {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al actualizar el reporte"), JSON_UNESCAPED_UNICODE);
            @sqlsrv_close($conn);
            exit;
        }

        @sqlsrv_close($conn);
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "id" => $id,
            "message" => "Reporte actualizado correctamente."
        ), JSON_UNESCAPED_UNICODE);
        exit;
    }

    // -------------------------------------------------------------
    // ACCIÓN 3: UPSERT COMPLETO (Sincronización inicial desde APK)
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

    // Procesamiento fotográfico
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

    // Verificar si ya existe el ID para decidir entre UPDATE o INSERT
    $sqlCheck = "SELECT COUNT(1) AS total FROM [dbo].[valkiria_reportes] WHERE id = ?";
    $stmtCheck = @sqlsrv_query($conn, $sqlCheck, array($id));
    $exists = false;
    if ($stmtCheck !== false && $rowCheck = @sqlsrv_fetch_array($stmtCheck, SQLSRV_FETCH_ASSOC)) {
        $exists = intval($rowCheck['total']) > 0;
    }

    if ($exists) {
        $sqlUpdateAll = "UPDATE [dbo].[valkiria_reportes] 
                         SET jefe_tob = ?, telefono = ?, lugar_mision = ?, personal = ?, maquinaria = ?, ocurrencias = ?,
                             latitud = CASE WHEN ? <> 0 THEN ? ELSE latitud END,
                             longitud = CASE WHEN ? <> 0 THEN ? ELSE longitud END,
                             altitud = CASE WHEN ? <> 0 THEN ? ELSE altitud END,
                             precision_m = CASE WHEN ? <> 0 THEN ? ELSE precision_m END,
                             dms = COALESCE(NULLIF(?, ''), dms),
                             foto_path = COALESCE(?, foto_path),
                             foto_base64 = COALESCE(?, foto_base64),
                             ip_origen = ?
                         WHERE id = ?";
        $paramsUpd = array(
            $jefeTob, $telefono, $lugarMision, $personal, $maquinaria, $ocurrencias,
            $latitud, $latitud,
            $longitud, $longitud,
            $altitud, $altitud,
            $precisionM, $precisionM,
            $dms,
            $fotoPath,
            $fotoBase64,
            $ipOrigen,
            $id
        );
        $stmt = @sqlsrv_query($conn, $sqlUpdateAll, $paramsUpd);
    } else {
        $sqlInsert = "INSERT INTO [dbo].[valkiria_reportes] 
                      (id, jefe_tob, telefono, lugar_mision, personal, maquinaria, ocurrencias, 
                       latitud, longitud, altitud, precision_m, dms, foto_path, foto_base64, fecha_registro, ip_origen)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATETIME(), ?)";
        $paramsIns = array(
            $id, $jefeTob, $telefono, $lugarMision, $personal, $maquinaria, $ocurrencias,
            $latitud, $longitud, $altitud, $precisionM, $dms, $fotoPath, $fotoBase64, $ipOrigen
        );
        $stmt = @sqlsrv_query($conn, $sqlInsert, $paramsIns);
    }

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Error al persistir reporte"
        ), JSON_UNESCAPED_UNICODE);
        @sqlsrv_close($conn);
        exit;
    }

    // Actualizar foto binaria si fue proporcionada
    if ($fotoBlob !== null) {
        $sqlBlob = "UPDATE [dbo].[valkiria_reportes] SET foto_blob = ? WHERE id = ?";
        $paramBlob = array(
            array($fotoBlob, SQLSRV_PARAM_IN, SQLSRV_PHPTYPE_STREAM(SQLSRV_ENC_BINARY), SQLSRV_SQLTYPE_VARBINARY('max')),
            $id
        );
        @sqlsrv_query($conn, $sqlBlob, $paramBlob);
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
