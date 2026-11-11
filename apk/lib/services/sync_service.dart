import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/survey_report.dart';
import '../config/app_config.dart';
import 'database_service.dart';

class SyncService {
  static final SyncService instance = SyncService._internal();
  SyncService._internal();

  bool _isSyncing = false;
  bool get isSyncing => _isSyncing;

  // Inicializa el monitor de conectividad para sincronización automática
  void initConnectivityWatcher() {
    Connectivity().onConnectivityChanged.listen((List<ConnectivityResult> results) {
      final hasConnection = results.any((r) =>
          r == ConnectivityResult.mobile ||
          r == ConnectivityResult.wifi ||
          r == ConnectivityResult.ethernet);

      if (hasConnection && !_isSyncing) {
        syncAllPending();
      }
    });
  }

  // Obtener la URL del servicio REST de Valkiria (IIS + PHP + SQL Server)
  Future<String> getServerApiUrl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AppConfig.prefApiUrl) ?? AppConfig.defaultApiUrl;
  }

  // Guardar la URL del servicio REST
  Future<void> saveServerApiUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConfig.prefApiUrl, url.trim());
  }

  // Sincronizar un único reporte con la API REST y SQL Server
  Future<bool> syncReport(SurveyReport report) async {
    try {
      await DatabaseService.instance.updateSyncStatus(
        report.id,
        SyncStatus.sending,
      );

      final apiUrl = await getServerApiUrl();

      // 1. Preparar foto en Base64 si existe
      String? fotoBase64;
      if (report.fotoLocalPath != null && report.fotoLocalPath!.isNotEmpty) {
        final f = File(report.fotoLocalPath!);
        if (await f.exists()) {
          final bytes = await f.readAsBytes();
          fotoBase64 = base64Encode(bytes);
        }
      }

      // 2. Construir payload para el servicio REST PHP
      final payload = {
        'id': report.id,
        'jefe_tob': report.jefeTob,
        'telefono': report.telefono,
        'lugar_mision': report.lugarMision,
        'personal': report.persona,
        'maquinaria': report.maquinaria,
        'ocurrencias': report.ocurrencias,
        'coordenadas': {
          'lat': report.gps.latitude,
          'lon': report.gps.longitude,
          'altitud': report.gps.altitude,
          'precision_m': report.gps.accuracy,
          'dms': report.gps.toDMS(),
        },
        if (fotoBase64 != null) 'foto_base64': fotoBase64,
        'foto_nombre': '${report.id}.jpg',
      };

      // 3. Envío HTTP POST al servidor IIS
      final response = await http
          .post(
            Uri.parse(apiUrl),
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Accept': 'application/json',
            },
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 35));

      if (response.statusCode == 200 || response.statusCode == 201) {
        final resData = jsonDecode(response.body);
        if (resData['success'] == true) {
          // Marcar como completado y persistido en SQL Server
          await DatabaseService.instance.updateSyncStatus(
            report.id,
            SyncStatus.sent,
            errorMessage: null,
          );
          return true;
        }
      }

      throw Exception('Servidor respondió (${response.statusCode}): ${response.body}');
    } catch (e) {
      await DatabaseService.instance.updateSyncStatus(
        report.id,
        SyncStatus.error,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  // Sincronizar todos los reportes pendientes de la Bandeja de Salida (Outbox)
  Future<int> syncAllPending() async {
    if (_isSyncing) return 0;
    _isSyncing = true;

    int successCount = 0;
    try {
      final toSync = await DatabaseService.instance.getAllReports(
        statusFilter: SyncStatus.pending,
        includeErrorsForPending: true,
      );

      for (final rep in toSync) {
        final ok = await syncReport(rep);
        if (ok) successCount++;
      }
    } finally {
      _isSyncing = false;
    }

    return successCount;
  }
}
