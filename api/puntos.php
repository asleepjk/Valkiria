<?php
/**
 * VALKIRIA GEOJSON FEED API - Servidor Producción VRAEM (10.65.201.28)
 * Base de Datos: SEGUIMIENTO | Tabla: valkiria_reportes
 * Endpoint: https://www.idep.gob.pe/seguimiento/api/puntos.php
 * Ubicación en Servidor: C:\inetpub\wwwroot\seguimiento\api\puntos.php
 *
 * Devuelve un FeatureCollection GeoJSON con los 7 campos operativos en el orden exacto
 * del aplicativo móvil y la URL de transmisión directa de la foto mediante foto.php.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-cache, no-store, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
    echo json_encode(array("type" => "FeatureCollection", "features" => array()));
    exit;
}

$sql = "SELECT id, jefe_tob, telefono, lugar_mision, personal, maquinaria, ocurrencias, 
               latitud, longitud, altitud, precision_m, dms, foto_path, foto_base64,
               CONVERT(VARCHAR(20), fecha_registro, 120) as fecha_registro
        FROM [dbo].[valkiria_reportes]
        WHERE latitud IS NOT NULL AND longitud IS NOT NULL
        ORDER BY fecha_registro DESC";

$stmt = @sqlsrv_query($conn, $sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(array("type" => "FeatureCollection", "features" => array()));
    @sqlsrv_close($conn);
    exit;
}

$features = array();
$baseUrl = "https://www.idep.gob.pe/seguimiento/api/";

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $lon = floatval($row['longitud']);
    $lat = floatval($row['latitud']);

    // Resolver URL de foto streaming hacia foto.php
    $fotoUrl = null;
    $hasPhoto = (!empty($row['foto_base64']) || !empty($row['foto_path']));
    if ($hasPhoto) {
        $fotoUrl = $baseUrl . "foto.php?id=" . urlencode($row['id']);
    }

    $features[] = array(
        "type" => "Feature",
        "geometry" => array(
            "type" => "Point",
            "coordinates" => array($lon, $lat)
        ),
        "properties" => array(
            "CODIGO"       => $row['id'],
            "JEFE_TOB"     => $row['jefe_tob'],
            "TELEFONO"     => $row['telefono'],
            "LUGAR"        => $row['lugar_mision'] ? $row['lugar_mision'] : 'Punto de Misión',
            "PERSONAL"     => $row['personal'],
            "MAQUINARIA"   => $row['maquinaria'],
            "OCURRENCIAS"  => $row['ocurrencias'],
            "FOTO"         => $fotoUrl,
            "ALTITUD"      => ($row['altitud'] !== null) ? floatval($row['altitud']) : null,
            "PRECISION_M"  => ($row['precision_m'] !== null) ? floatval($row['precision_m']) : null,
            "DMS"          => $row['dms'],
            "FECHA"        => $row['fecha_registro']
        )
    );
}

@sqlsrv_close($conn);

echo json_encode(array(
    "type" => "FeatureCollection",
    "features" => $features
), JSON_UNESCAPED_UNICODE);
