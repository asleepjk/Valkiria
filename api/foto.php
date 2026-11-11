<?php
/**
 * VALKIRIA PHOTO STREAMING SERVICE - Producción (10.65.201.28)
 * Endpoint: https://www.idep.gob.pe/seguimiento/api/foto.php?id=VAL-xxx
 * Ubicación en Servidor: C:\inetpub\wwwroot\seguimiento\api\foto.php
 *
 * Sirve la evidencia fotográfica forense de campo directamente desde la base de datos
 * SQL Server (o caché de disco), eliminando por completo cualquier problema de permisos NTFS en IIS.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$id = isset($_GET['id']) ? trim($_GET['id']) : '';
if (empty($id)) {
    http_response_code(400);
    header('Content-Type: text/plain');
    echo 'Identificador de reporte requerido.';
    exit;
}

// Limpiar ID contra inyección de nombres de archivo
$id = preg_replace('/[^A-Za-z0-9_\-]/', '', $id);

// 1. Verificar si existe en caché de disco local
$diskFile = __DIR__ . '/fotos/' . $id . '.jpg';
if (file_exists($diskFile) && filesize($diskFile) > 0) {
    header('Content-Type: image/jpeg');
    header('Cache-Control: public, max-age=86400');
    header('Content-Length: ' . filesize($diskFile));
    readfile($diskFile);
    exit;
}

// 2. Si no está en disco, consultar directamente SQL Server SEGUIMIENTO
$serverName = "localhost";
$connectionOptions = array(
    "Database" => "SEGUIMIENTO",
    "Uid" => "sa",
    "PWD" => "Ign2015",
    "CharacterSet" => "UTF-8"
);

$conn = @sqlsrv_connect($serverName, $connectionOptions);
if ($conn === false) {
    servePlaceholder();
    exit;
}

$sql = "SELECT foto_blob, foto_base64, foto_path FROM [dbo].[valkiria_reportes] WHERE id = ?";
$stmt = @sqlsrv_query($conn, $sql, array($id));

if ($stmt && $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    // A. Prioridad 1: Columna binaria nativa (foto_blob)
    if (!empty($row['foto_blob'])) {
        $blobData = $row['foto_blob'];
        header('Content-Type: image/jpeg');
        header('Cache-Control: public, max-age=86400');
        echo $blobData;
        @sqlsrv_close($conn);
        exit;
    }

    // B. Prioridad 2: Columna Base64 directa (foto_base64)
    if (!empty($row['foto_base64'])) {
        $bytes = base64_decode($row['foto_base64']);
        if ($bytes !== false) {
            header('Content-Type: image/jpeg');
            header('Cache-Control: public, max-age=86400');
            echo $bytes;
            @sqlsrv_close($conn);
            exit;
        }
    }
}

@sqlsrv_close($conn);

// 3. Si no existe foto en BD, servir marcador visual estándar
servePlaceholder();

function servePlaceholder() {
    header('Content-Type: image/svg+xml');
    header('Cache-Control: public, max-age=3600');
    echo '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#0f172a"/>
        <circle cx="200" cy="130" r="50" fill="#1e293b"/>
        <path d="M185 130a15 15 0 1 0 30 0a15 15 0 1 0 -30 0" fill="#38bdf8"/>
        <path d="M170 160h60v6H170z" fill="#64748b"/>
        <text x="200" y="220" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle" font-weight="bold">FOTO NO DISPONIBLE</text>
        <text x="200" y="240" font-family="Arial, sans-serif" font-size="11" fill="#64748b" text-anchor="middle">SIN EVIDENCIA FOTOGRÁFICA REGISTRADA</text>
    </svg>';
    exit;
}
