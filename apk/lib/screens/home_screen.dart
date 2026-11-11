import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';
import '../config/app_theme.dart';
import '../models/gps_location.dart';
import '../services/database_service.dart';
import '../services/gps_service.dart';
import '../services/sync_service.dart';
import '../widgets/accuracy_badge.dart';
import 'survey_form_screen.dart';
import 'minimap_screen.dart';
import 'outbox_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  GPSLocation? _currentGPS;
  int _pendingCount = 0;
  String _jefeTob = '';
  String _telefono = '';

  @override
  void initState() {
    super.initState();
    _loadProfile();
    _loadPendingCount();
    _initGPS();
    SyncService.instance.initConnectivityWatcher();
  }

  Future<void> _loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _jefeTob = prefs.getString(AppConfig.prefJefeTob) ?? 'Operador';
      _telefono = prefs.getString(AppConfig.prefTelefono) ?? '';
    });
  }

  Future<void> _loadPendingCount() async {
    final count = await DatabaseService.instance.getPendingCount();
    setState(() {
      _pendingCount = count;
    });
  }

  void _initGPS() {
    GPSService.instance.getCurrentPosition().then((pos) {
      if (mounted) {
        setState(() => _currentGPS = pos);
      }
    });

    GPSService.instance.positionStream.listen((pos) {
      if (mounted) {
        setState(() => _currentGPS = pos);
      }
    });
  }

  void _openSettingsDialog() {
    final apiCtrl = TextEditingController();
    final jefeCtrl = TextEditingController(text: _jefeTob);
    final telCtrl = TextEditingController(text: _telefono);

    SyncService.instance.getServerApiUrl().then((url) {
      apiCtrl.text = url;
    });

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Row(
          children: [
            Icon(Icons.tune_rounded, color: AppTheme.primaryLight),
            SizedBox(width: 8),
            Text('Ajustes y Servidor SQL', style: TextStyle(fontSize: 16)),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: jefeCtrl,
                decoration: const InputDecoration(labelText: 'Jefe de TOB por Defecto'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: telCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'Teléfono de Contacto'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: apiCtrl,
                decoration: const InputDecoration(
                  labelText: 'URL de la API REST Valkiria',
                  hintText: 'https://www.idep.gob.pe/seguimiento/api/sync.php',
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Endpoint HTTPS en producción IDEP que inserta en la base de datos SQL Server SEGUIMIENTO.',
                style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            onPressed: () async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.setString(AppConfig.prefJefeTob, jefeCtrl.text.trim());
              await prefs.setString(AppConfig.prefTelefono, telCtrl.text.trim());
              if (apiCtrl.text.trim().isNotEmpty) {
                await SyncService.instance.saveServerApiUrl(apiCtrl.text.trim());
              }
              _loadProfile();
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.shield_rounded, color: AppTheme.primaryLight, size: 22),
            ),
            const SizedBox(width: 10),
            const Text(AppConfig.appName, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Sistema Táctico de Recolección de Campo y Posicionamiento Cartográfico Offline.',
              style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 16),
            const Divider(color: AppTheme.surfaceElevated),
            const SizedBox(height: 12),
            const Text(
              'CRÉDITOS Y DERECHOS DE AUTOR',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.primaryLight, letterSpacing: 0.8),
            ),
            const SizedBox(height: 6),
            const Text(
              'Desarrollado por Ing. Anthony Quispe Espinoza - Todos los derechos reservados - Lima, Perú',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white, height: 1.3),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black38,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: Colors.white12),
              ),
              child: const Text(
                'Contacto : althair530@gmail.com - +51970465236',
                style: TextStyle(fontSize: 11, fontFamily: 'monospace', color: AppTheme.accent),
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Entendido'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppTheme.primary.withOpacity(0.4)),
              ),
              child: const Icon(Icons.shield_rounded, size: 20, color: AppTheme.primaryLight),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(AppConfig.appName, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text(
                  _jefeTob.isNotEmpty ? 'TOB: $_jefeTob' : 'Recolección Táctica',
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.normal),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline_rounded),
            tooltip: 'Acerca de Valkiria',
            onPressed: _showAboutDialog,
          ),
          IconButton(
            icon: const Icon(Icons.tune_rounded),
            tooltip: 'Configuración',
            onPressed: _openSettingsDialog,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await _loadPendingCount();
          await _loadProfile();
          final pos = await GPSService.instance.getCurrentPosition();
          setState(() => _currentGPS = pos);
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 1. Tarjeta de Estado GPS en Vivo
            _buildGPSCard(),
            const SizedBox(height: 16),

            // 2. Botón Maestro: NUEVO REPORTE DE CAMPO
            _buildNewReportButton(),
            const SizedBox(height: 16),

            // 3. Tarjeta de Bandeja de Salida (Outbox)
            _buildOutboxCard(),
            const SizedBox(height: 16),

            // 4. Tarjeta del Minimapa Táctico Offline
            _buildMinimapCard(),
            const SizedBox(height: 20),

            // 5. Tarjeta de Créditos y Autoría
            _buildCreditsCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildGPSCard() {
    final gps = _currentGPS ?? GPSLocation.mockBouar();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceDark,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Row(
                  children: [
                    Icon(Icons.satellite_alt_rounded, size: 16, color: AppTheme.primaryLight),
                    SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        'POSICIONAMIENTO GPS',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: AppTheme.textSecondary),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              AccuracyBadge(gps: gps),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            gps.toDMS(),
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, fontFamily: 'monospace', color: Colors.white, letterSpacing: 0.5),
          ),
          const SizedBox(height: 4),
          Text(
            'DD: ${gps.toDD()} | Altitud: ${gps.altitude.round()} m',
            style: const TextStyle(fontSize: 11, color: AppTheme.textMuted, fontFamily: 'monospace'),
          ),
        ],
      ),
    );
  }

  Widget _buildNewReportButton() {
    return InkWell(
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(builder: (ctx) => const SurveyFormScreen()),
        );
        _loadPendingCount();
        _loadProfile();
      },
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF0284C7), Color(0xFF0369A1)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primary.withOpacity(0.35),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add_location_alt_rounded, size: 26, color: Colors.white),
            SizedBox(width: 12),
            Text(
              'NUEVO REGISTRO DE CAMPO',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 0.5, color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOutboxCard() {
    return InkWell(
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(builder: (ctx) => const OutboxScreen()),
        );
        _loadPendingCount();
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: _pendingCount > 0 ? AppTheme.warning.withOpacity(0.5) : AppTheme.surfaceElevated,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: (_pendingCount > 0 ? AppTheme.warning : AppTheme.accent).withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                _pendingCount > 0 ? Icons.outbox_rounded : Icons.mark_email_read_rounded,
                color: _pendingCount > 0 ? AppTheme.warning : AppTheme.accent,
                size: 24,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Bandeja de Salida', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 2),
                  Text(
                    _pendingCount > 0
                        ? '$_pendingCount reporte(s) pendiente(s) de sincronizar'
                        : 'Todos los reportes sincronizados con el repositorio',
                    style: TextStyle(fontSize: 11, color: _pendingCount > 0 ? AppTheme.warning : AppTheme.textMuted),
                  ),
                ],
              ),
            ),
            if (_pendingCount > 0)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.warning,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$_pendingCount',
                  style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              )
            else
              const Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted),
          ],
        ),
      ),
    );
  }

  Widget _buildMinimapCard() {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (ctx) => const MinimapScreen()),
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.surfaceElevated),
        ),
        child: const Row(
          children: [
            Icon(Icons.map_rounded, color: AppTheme.primaryLight, size: 24),
            SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Visor Cartográfico Offline', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  SizedBox(height: 2),
                  Text('Límites RCA, Zonas, Pistas y Puntos Registrados', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: AppTheme.textMuted),
          ],
        ),
      ),
    );
  }

  Widget _buildCreditsCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceDark,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.verified_user_rounded, size: 16, color: AppTheme.primaryLight),
              SizedBox(width: 8),
              Text(
                'CRÉDITOS & AUTORÍA',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: AppTheme.primaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Desarrollado por Ing. Anthony Quispe Espinoza - Todos los derechos reservados - Lima, Perú',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.white,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black26,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: Colors.white12),
            ),
            child: const Text(
              'Contacto : althair530@gmail.com - +51970465236',
              style: TextStyle(
                fontSize: 11,
                fontFamily: 'monospace',
                color: AppTheme.accent,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
