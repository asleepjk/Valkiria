<?php
/**
 * VALKIRIA GEOJSON FEED API - Servidor Producción VRAEM (10.65.201.28)
 * Base de Datos: SEGUIMIENTO | Tabla: valkiria_reportes
 * Endpoint: https://www.idep.gob.pe/seguimiento/api/puntos.php
 * Ubicación en Servidor: C:\inetpub\wwwroot\seguimiento\api\puntos.php
 *
 * Devuelve un FeatureCollection GeoJSON estandarizado con los puntos registrados
 * desde el aplicativo móvil Valkiria para su renderizado en tiempo real en el visor web.
 *
 * SEGURIDAD: Cero exposición de datos sensibles (IP, nombres de BD, credenciales o trazas de error).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-cache, no-store, must-revalidate');

// Manejo de preflight CORS OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Configuración de Conexión a SQL Server en Localhost (dentro de 10.65.201.28)
$serverName = "localhost";
$connectionOptions = array(
    "Database" => "SEGUIMIENTO",
    "Uid" => "sa",
    "PWD" => "Ign2015",
    "CharacterSet" => "UTF-8"
);

// Conectar con supresión de errores para evitar cualquier fuga de información
$conn = @sqlsrv_connect($serverName, $connectionOptions);
if ($conn === false) {
    http_response_code(500);
    echo json_encode(array(
        "type" => "FeatureCollection",
        "features" => array()
    ));
    exit;
}

// 2. Consulta de Reportes de Campo
$sql = "SELECT id, jefe_tob, telefono, lugar_mision, personal, maquinaria, ocurrencias, 
               latitud, longitud, altitud, precision_m, dms, foto_path, 
               CONVERT(VARCHAR(20), fecha_registro, 120) as fecha_registro
        FROM [dbo].[valkiria_reportes]
        WHERE latitud IS NOT NULL AND longitud IS NOT NULL
        ORDER BY fecha_registro DESC";

$stmt = @sqlsrv_query($conn, $sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(array(
        "type" => "FeatureCollection",
        "features" => array()
    ));
    @sqlsrv_close($conn);
    exit;
}

// 3. Ensamblado del GeoJSON FeatureCollection
$features = array();
$baseUrl = "https://www.idep.gob.pe/seguimiento/api/";

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $lon = floatval($row['longitud']);
    $lat = floatval($row['latitud']);

    // Resolver URL completa de la foto si existe
    $fotoUrl = null;
    if (!empty($row['foto_path'])) {
        $cleanPath = trim($row['foto_path']);
        if (strpos($cleanPath, 'http://') === 0 || strpos($cleanPath, 'https://') === 0) {
            $fotoUrl = $cleanPath;
        } else {
            $fotoUrl = $baseUrl . ltrim($cleanPath, '/');
        }
    }

    $features[] = array(
        "type" => "Feature",
        "geometry" => array(
            "type" => "Point",
            "coordinates" => array($lon, $lat)
        ),
        "properties" => array(
            "CODIGO"       => $row['id'],
            "LUGAR"        => $row['lugar_mision'] ? $row['lugar_mision'] : 'Punto de Misión',
            "JEFE_TOB"     => $row['jefe_tob'],
            "TELEFONO"     => $row['telefono'],
            "PERSONAL"     => $row['personal'],
            "MAQUINARIA"   => $row['maquinaria'],
            "OCURRENCIAS"  => $row['ocurrencias'],
            "ALTITUD"      => ($row['altitud'] !== null) ? floatval($row['altitud']) : null,
            "PRECISION_M"  => ($row['precision_m'] !== null) ? floatval($row['precision_m']) : null,
            "DMS"          => $row['dms'],
            "FOTO"         => $fotoUrl,
            "FECHA"        => $row['fecha_registro']
        )
    );
}

@sqlsrv_close($conn);

echo json_encode(array(
    "type" => "FeatureCollection",
    "features" => $features
), JSON_UNESCAPED_UNICODE);
