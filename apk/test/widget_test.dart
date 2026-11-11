import 'package:flutter_test/flutter_test.dart';
import 'package:tactical/config/app_config.dart';
import 'package:tactical/models/gps_location.dart';
import 'package:tactical/models/survey_report.dart';

void main() {
  group('Valkiria Core Unit Tests', () {
    test('AppConfig constants verification', () {
      expect(AppConfig.appName, 'Valkiria');
      expect(AppConfig.defaultApiUrl, 'https://www.idep.gob.pe/seguimiento/api/sync.php');
      expect(AppConfig.developerName, 'Ing. Anthony Quispe Espinoza');
      expect(AppConfig.contactEmail, 'althair530@gmail.com');
      expect(AppConfig.contactPhone, '+51970465236');
    });

    test('GPSLocation DMS formatting and quality', () {
      final gps = GPSLocation(
        latitude: 5.950149,
        longitude: 15.638896,
        altitude: 624.0,
        accuracy: 3.2,
        heading: 0.0,
        timestamp: DateTime.now(),
      );

      expect(gps.quality, GPSQuality.optimal);
      expect(gps.toDMS(), contains('05°57\'01"N'));
      expect(gps.toDMS(), contains('15°38\'20"E'));
    });

    test('SurveyReport SQLite serialization and deserialization', () {
      final gps = GPSLocation.mockBouar();
      final original = SurveyReport(
        id: 'VAL-20261111-TEST',
        jefeTob: 'Cap. Anthony Quispe',
        telefono: '970465236',
        lugarMision: 'Bouar Sector Alpha',
        persona: 'Contacto Local',
        maquinaria: 'Tractor Oruga CAT D6',
        ocurrencias: 'Despeje de vía concluido con normalidad.',
        gps: gps,
        fotoLocalPath: '/data/user/0/com.valkiria.tactical/cache/VAL-20261111-TEST_1.jpg',
        syncStatus: SyncStatus.pending,
        createdAt: DateTime.parse('2026-11-11T12:00:00Z'),
        updatedAt: DateTime.parse('2026-11-11T12:00:00Z'),
      );

      final map = original.toMap();
      final restored = SurveyReport.fromMap(map);

      expect(restored.id, original.id);
      expect(restored.jefeTob, 'Cap. Anthony Quispe');
      expect(restored.telefono, '970465236');
      expect(restored.lugarMision, 'Bouar Sector Alpha');
      expect(restored.persona, 'Contacto Local');
      expect(restored.maquinaria, 'Tractor Oruga CAT D6');
      expect(restored.ocurrencias, 'Despeje de vía concluido con normalidad.');
      expect(restored.gps.latitude, gps.latitude);
      expect(restored.gps.longitude, gps.longitude);
      expect(restored.fotoLocalPath, original.fotoLocalPath);
      expect(restored.syncStatus, SyncStatus.pending);
    });

    test('SurveyReport GitHub Manifest Generation', () {
      final gps = GPSLocation.mockBouar();
      final report = SurveyReport(
        id: 'VAL-20261111-TEST',
        jefeTob: 'Ing. Anthony Quispe',
        telefono: '970465236',
        lugarMision: 'Bouar Central',
        persona: 'Personal Operativo',
        maquinaria: 'Motoniveladora',
        ocurrencias: 'Mantenimiento de pista de aterrizaje',
        gps: gps,
        createdAt: DateTime.parse('2026-11-11T12:00:00Z'),
        updatedAt: DateTime.parse('2026-11-11T12:00:00Z'),
      );

      final manifest = report.toGithubManifest(
        remotePhoto: 'assets/fotos/VAL-20261111-TEST.jpg',
      );

      expect(manifest['id'], 'VAL-20261111-TEST');
      expect(manifest['jefe_tob'], 'Ing. Anthony Quispe');
      expect(manifest['telefono'], '970465236');
      expect(manifest['lugar_mision'], 'Bouar Central');
      expect(manifest['persona'], 'Personal Operativo');
      expect(manifest['maquinaria'], 'Motoniveladora');
      expect(manifest['ocurrencias'], 'Mantenimiento de pista de aterrizaje');
      expect(manifest['propiedades']['CODIGO'], 'VAL-20261111-TEST');
      expect(manifest['propiedades']['JEFE_TOB'], 'Ing. Anthony Quispe');
      expect(manifest['propiedades']['TELEFONO'], '970465236');
      expect(manifest['propiedades']['FOTO'], 'assets/fotos/VAL-20261111-TEST.jpg');
    });
  });
}
