import 'dart:convert';
import 'gps_location.dart';

enum SyncStatus {
  draft,
  pending,
  sending,
  sent,
  error;

  String get label {
    switch (this) {
      case SyncStatus.draft:
        return 'Borrador';
      case SyncStatus.pending:
        return 'En Cola (Bandeja de Salida)';
      case SyncStatus.sending:
        return 'Transmitiendo...';
      case SyncStatus.sent:
        return 'Enviado con Éxito';
      case SyncStatus.error:
        return 'Error de Envío';
    }
  }

  static SyncStatus fromString(String? val) {
    switch (val?.toLowerCase()) {
      case 'draft':
        return SyncStatus.draft;
      case 'pending':
        return SyncStatus.pending;
      case 'sending':
        return SyncStatus.sending;
      case 'sent':
        return SyncStatus.sent;
      case 'error':
      default:
        return SyncStatus.error;
    }
  }
}

class SurveyReport {
  final String id;
  final String jefeTob;
  final String telefono;
  final String lugarMision;
  final String persona;
  final String maquinaria;
  final String ocurrencias;
  final GPSLocation gps;
  final String? fotoLocalPath;
  SyncStatus syncStatus;
  final DateTime createdAt;
  DateTime updatedAt;
  String? errorMessage;

  SurveyReport({
    required this.id,
    required this.jefeTob,
    required this.telefono,
    required this.lugarMision,
    required this.persona,
    required this.maquinaria,
    required this.ocurrencias,
    required this.gps,
    this.fotoLocalPath,
    this.syncStatus = SyncStatus.pending,
    required this.createdAt,
    required this.updatedAt,
    this.errorMessage,
  });

  // Mapeo para persistencia en SQLite (Outbox local)
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'jefe_tob': jefeTob,
      'telefono': telefono,
      'lugar_mision': lugarMision,
      'persona': persona,
      'maquinaria': maquinaria,
      'ocurrencias': ocurrencias,
      'latitude': gps.latitude,
      'longitude': gps.longitude,
      'altitude': gps.altitude,
      'accuracy': gps.accuracy,
      'heading': gps.heading,
      'foto_local': fotoLocalPath,
      'sync_status': syncStatus.name,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'error_message': errorMessage,
    };
  }

  factory SurveyReport.fromMap(Map<String, dynamic> map) {
    return SurveyReport(
      id: map['id'] as String,
      jefeTob: map['jefe_tob'] as String? ?? '',
      telefono: map['telefono'] as String? ?? '',
      lugarMision: map['lugar_mision'] as String? ?? '',
      persona: map['persona'] as String? ?? '',
      maquinaria: map['maquinaria'] as String? ?? '',
      ocurrencias: map['ocurrencias'] as String? ?? '',
      gps: GPSLocation(
        latitude: (map['latitude'] as num).toDouble(),
        longitude: (map['longitude'] as num).toDouble(),
        altitude: (map['altitude'] as num?)?.toDouble() ?? 0.0,
        accuracy: (map['accuracy'] as num?)?.toDouble() ?? 0.0,
        heading: (map['heading'] as num?)?.toDouble() ?? 0.0,
        timestamp: DateTime.tryParse(map['created_at'] ?? '') ?? DateTime.now(),
      ),
      fotoLocalPath: map['foto_local'] as String?,
      syncStatus: SyncStatus.fromString(map['sync_status'] as String?),
      createdAt: DateTime.tryParse(map['created_at'] ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(map['updated_at'] ?? '') ?? DateTime.now(),
      errorMessage: map['error_message'] as String?,
    );
  }

  // Generación del payload JSON estandarizado para GitHub y el Visor Web
  Map<String, dynamic> toGithubManifest({
    String? remotePhoto,
  }) {
    return {
      'id': id,
      'timestamp': createdAt.toUtc().toIso8601String(),
      'jefe_tob': jefeTob,
      'telefono': telefono,
      'lugar_mision': lugarMision,
      'persona': persona,
      'maquinaria': maquinaria,
      'ocurrencias': ocurrencias,
      'coordenadas': {
        'lat': gps.latitude,
        'lon': gps.longitude,
        'altitud': gps.altitude,
        'precision_m': gps.accuracy,
        'dms': gps.toDMS(),
      },
      'propiedades': {
        'CODIGO': id,
        'JEFE_TOB': jefeTob,
        'TELEFONO': telefono,
        'LUGAR': lugarMision,
        'PERSONA': persona,
        'MAQUINARIA': maquinaria,
        'OCURRENCIAS': ocurrencias,
        'FOTO': remotePhoto ?? '',
        'fecha_envio': createdAt.toIso8601String(),
      }
    };
  }

  String toGithubJsonPretty({
    String? remotePhoto,
  }) {
    return const JsonEncoder.withIndent('  ').convert(
      toGithubManifest(
        remotePhoto: remotePhoto,
      ),
    );
  }
}
