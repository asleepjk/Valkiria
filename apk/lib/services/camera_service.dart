import 'dart:io';
import 'dart:typed_data';
import 'package:image/image.dart' as img;
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:intl/intl.dart';
import '../models/gps_location.dart';
import '../config/app_config.dart';

class CameraService {
  static final CameraService instance = CameraService._internal();
  CameraService._internal();

  // Procesa, comprime a Full HD y estampa los metadatos forenses en la imagen
  Future<String> processAndWatermarkPhoto({
    required String rawImagePath,
    required String reportId,
    required GPSLocation gps,
    required String operatorName,
    required int photoIndex,
  }) async {
    final rawFile = File(rawImagePath);
    final Uint8List rawBytes = await rawFile.readAsBytes();

    // 1. Decodificar la imagen
    img.Image? decoded = img.decodeImage(rawBytes);
    if (decoded == null) {
      throw Exception('No se pudo decodificar la imagen capturada.');
    }

    // Corregir orientación EXIF si aplica
    decoded = img.bakeOrientation(decoded);

    // 2. Redimensionar a Full HD táctico si sobrepasa los límites
    if (decoded.width > AppConfig.photoMaxWidth ||
        decoded.height > AppConfig.photoMaxHeight) {
      if (decoded.width >= decoded.height) {
        decoded = img.copyResize(decoded, width: AppConfig.photoMaxWidth);
      } else {
        decoded = img.copyResize(decoded, height: AppConfig.photoMaxHeight);
      }
    }

    // 3. Estampado Forense Táctico (Marca de Agua indeleble)
    final width = decoded.width;
    final height = decoded.height;
    final bannerHeight = (height * 0.08).round().clamp(60, 110);
    final bannerTop = height - bannerHeight;

    // Franja inferior oscura semitransparente
    img.fillRect(
      decoded,
      x1: 0,
      y1: bannerTop,
      x2: width,
      y2: height,
      color: img.ColorRgba8(10, 15, 30, 215), // Azul marino muy oscuro
    );

    // Línea separadora táctica superior (Sky blue)
    img.fillRect(
      decoded,
      x1: 0,
      y1: bannerTop,
      x2: width,
      y2: bannerTop + 3,
      color: img.ColorRgba8(56, 189, 248, 255), // Sky 400
    );

    // Texto de la franja
    final dateStr = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now().toUtc());
    final line1 = '[VALKIRIA] ID: $reportId | $dateStr UTC';
    final line2 = 'COORD: ${gps.toDMS()} (±${gps.accuracy.toStringAsFixed(1)}m) | TOB: $operatorName';

    // Dibujar texto con fuente Arial de img
    img.drawString(
      decoded,
      line1,
      font: img.arial24,
      x: 20,
      y: bannerTop + 10,
      color: img.ColorRgba8(248, 250, 252, 255),
    );

    img.drawString(
      decoded,
      line2,
      font: img.arial14,
      x: 20,
      y: bannerTop + 42,
      color: img.ColorRgba8(148, 163, 184, 255), // Slate 400
    );

    // 4. Comprimir a JPEG de alta eficiencia
    final processedBytes = img.encodeJpg(decoded, quality: AppConfig.photoQuality);

    // 5. Guardar en el directorio seguro de evidencias de la app
    final docsDir = await getApplicationDocumentsDirectory();
    final evidenceDir = Directory(p.join(docsDir.path, 'evidencias'));
    if (!await evidenceDir.exists()) {
      await evidenceDir.create(recursive: true);
    }

    final outFilename = '${reportId}_$photoIndex.jpg';
    final outFile = File(p.join(evidenceDir.path, outFilename));
    await outFile.writeAsBytes(processedBytes);

    return outFile.path;
  }

  // Copia el video grabado a la carpeta segura de evidencias
  Future<String> saveVideoEvidence({
    required String rawVideoPath,
    required String reportId,
  }) async {
    final docsDir = await getApplicationDocumentsDirectory();
    final evidenceDir = Directory(p.join(docsDir.path, 'evidencias'));
    if (!await evidenceDir.exists()) {
      await evidenceDir.create(recursive: true);
    }

    final outFilename = '${reportId}_video.mp4';
    final targetFile = File(p.join(evidenceDir.path, outFilename));
    final rawFile = File(rawVideoPath);

    if (await rawFile.exists()) {
      await rawFile.copy(targetFile.path);
      return targetFile.path;
    } else {
      throw Exception('El archivo de video temporal no existe: $rawVideoPath');
    }
  }
}
