import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:intl/intl.dart';
import '../config/app_theme.dart';
import '../models/gps_location.dart';
import '../models/survey_report.dart';
import '../services/database_service.dart';
import '../services/gps_service.dart';
import '../services/sync_service.dart';
import 'survey_form_screen.dart';

class MinimapScreen extends StatefulWidget {
  final String? focusReportId;
  final GPSLocation? focusLocation;

  const MinimapScreen({
    super.key,
    this.focusReportId,
    this.focusLocation,
  });

  @override
  State<MinimapScreen> createState() => _MinimapScreenState();
}

class _MinimapScreenState extends State<MinimapScreen> with SingleTickerProviderStateMixin {
  final MapController _mapController = MapController();

  GPSLocation? _myLocation;
  bool _showSatellite = true;
  bool _showZonas = true;
  bool _showRCA = true;
  bool _showAirports = true;
  bool _showReports = true;

  List<Polygon> _zonasPolygons = [];
  List<Polyline> _rcaLines = [];
  List<Marker> _airportMarkers = [];
  List<SurveyReport> _reports = [];
  bool _isLoadingLayers = true;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.5).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _initGPS();
    _loadOfflineLayers();
    _loadReports();

    if (widget.focusLocation != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _mapController.move(
          LatLng(widget.focusLocation!.latitude, widget.focusLocation!.longitude),
          12.0,
        );
      });
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _initGPS() {
    GPSService.instance.getCurrentPosition().then((pos) {
      if (mounted) setState(() => _myLocation = pos);
    });

    GPSService.instance.positionStream.listen((pos) {
      if (mounted) setState(() => _myLocation = pos);
    });
  }

  Future<void> _loadReports() async {
    try {
      final reps = await DatabaseService.instance.getAllReports();
      if (mounted) {
        setState(() {
          _reports = reps;
        });
      }
    } catch (_) {}
  }

  Future<void> _loadOfflineLayers() async {
    try {
      // 1. Cargar Zonas de Operación
      final zonasStr = await rootBundle.loadString('assets/layers/zonas.geojson');
      final zonasJson = jsonDecode(zonasStr);
      final List<Polygon> parsedZonas = [];

      for (final feat in zonasJson['features']) {
        final props = feat['properties'] ?? {};
        final name = (props['ZONAS'] ?? '').toString().toUpperCase();
        Color fillColor = const Color(0x50FFE4BE); // Center
        if (name == 'EAST') fillColor = const Color(0x50BED2FF);
        if (name == 'WEST') fillColor = const Color(0x50E8BEFF);

        final geom = feat['geometry'];
        if (geom['type'] == 'Polygon') {
          final List rings = geom['coordinates'];
          if (rings.isNotEmpty) {
            final List<LatLng> points = (rings[0] as List).map((c) {
              return LatLng((c[1] as num).toDouble(), (c[0] as num).toDouble());
            }).toList();

            parsedZonas.add(
              Polygon(
                points: points,
                color: fillColor,
                borderColor: const Color(0xFF64748B),
                borderStrokeWidth: 2,
              ),
            );
          }
        }
      }

      // 2. Cargar Límites de RCA
      final rcaStr = await rootBundle.loadString('assets/layers/rca.geojson');
      final rcaJson = jsonDecode(rcaStr);
      final List<Polyline> parsedRca = [];

      for (final feat in rcaJson['features']) {
        final geom = feat['geometry'];
        if (geom['type'] == 'Polygon') {
          for (final ring in geom['coordinates']) {
            final List<LatLng> points = (ring as List).map((c) {
              return LatLng((c[1] as num).toDouble(), (c[0] as num).toDouble());
            }).toList();

            parsedRca.add(
              Polyline(
                points: points,
                color: const Color(0xFFFF00C5),
                strokeWidth: 2.5,
              ),
            );
          }
        }
      }

      // 3. Cargar Aeródromos
      final airportStr = await rootBundle.loadString('assets/layers/airport.geojson');
      final airportJson = jsonDecode(airportStr);
      final List<Marker> parsedAirports = [];

      for (final feat in airportJson['features']) {
        final props = feat['properties'] ?? {};
        final name = props['Name'] ?? 'Pista';
        final geom = feat['geometry'];
        if (geom['type'] == 'Point') {
          final coords = geom['coordinates'];
          final point = LatLng((coords[1] as num).toDouble(), (coords[0] as num).toDouble());

          parsedAirports.add(
            Marker(
              point: point,
              width: 70,
              height: 40,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: Colors.black87,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 1.5),
                    ),
                    child: const Icon(Icons.flight_rounded, color: Colors.white, size: 12),
                  ),
                  Text(
                    name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      shadows: [Shadow(color: Colors.black, blurRadius: 3)],
                    ),
                  ),
                ],
              ),
            ),
          );
        }
      }

      if (mounted) {
        setState(() {
          _zonasPolygons = parsedZonas;
          _rcaLines = parsedRca;
          _airportMarkers = parsedAirports;
          _isLoadingLayers = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingLayers = false);
      }
    }
  }

  void _centerOnMyLocation() {
    if (_myLocation != null) {
      _mapController.move(
        LatLng(_myLocation!.latitude, _myLocation!.longitude),
        11.0,
      );
    }
  }

  void _centerOnRCA() {
    _mapController.move(const LatLng(6.6, 18.6), 6.5);
  }

  List<Marker> _buildReportMarkers() {
    if (!_showReports) return [];

    return _reports.map((rep) {
      final isFocused = rep.id == widget.focusReportId;
      final point = LatLng(rep.gps.latitude, rep.gps.longitude);

      return Marker(
        point: point,
        width: isFocused ? 84 : 70,
        height: isFocused ? 84 : 70,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () => _showReportDetailsModal(rep),
          child: Container(
            color: Colors.transparent,
            alignment: Alignment.center,
            child: isFocused
                ? AnimatedBuilder(
                    animation: _pulseAnimation,
                    builder: (ctx, child) {
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 52 * _pulseAnimation.value,
                            height: 52 * _pulseAnimation.value,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xFFF59E0B).withOpacity(0.35),
                              border: Border.all(color: const Color(0xFFFBBF24), width: 2),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xFFD97706),
                              border: Border.all(color: Colors.white, width: 2.5),
                              boxShadow: [
                                BoxShadow(color: Colors.black.withOpacity(0.6), blurRadius: 6),
                              ],
                            ),
                            child: const Icon(Icons.location_on_rounded, color: Colors.white, size: 24),
                          ),
                        ],
                      );
                    },
                  )
                : Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFF0284C7),
                      border: Border.all(color: Colors.white, width: 2),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 4),
                      ],
                    ),
                    child: const Icon(Icons.location_on_rounded, color: Colors.white, size: 20),
                  ),
          ),
        ),
      );
    }).toList();
  }

  void _showReportDetailsModal(SurveyReport rep) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.4,
        maxChildSize: 0.9,
        expand: false,
        builder: (ctx, scrollController) => ListView(
          controller: scrollController,
          padding: const EdgeInsets.all(20),
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppTheme.primary.withOpacity(0.5)),
                        ),
                        child: const Text('VALKIRIA - REPORTE DE CAMPO', style: TextStyle(color: AppTheme.primaryLight, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(height: 4),
                      Text(rep.id, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: rep.syncStatus == SyncStatus.sent ? AppTheme.accent.withOpacity(0.2) : AppTheme.warning.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    rep.syncStatus.label,
                    style: TextStyle(
                      color: rep.syncStatus == SyncStatus.sent ? AppTheme.accent : AppTheme.warning,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(color: AppTheme.surfaceElevated),
            const SizedBox(height: 12),

            _buildDetailRow('Jefe de TOB', rep.jefeTob),
            _buildDetailRow('Teléfono', rep.telefono),
            _buildDetailRow('Lugar de Misión', rep.lugarMision),
            _buildDetailRow('Personal', rep.persona),
            _buildDetailRow('Maquinaria', rep.maquinaria),
            _buildDetailRow('Ocurrencias', rep.ocurrencias),
            _buildDetailRow('Coordenadas DMS', rep.gps.toDMS()),
            _buildDetailRow('Coordenadas DD', '${rep.gps.latitude.toStringAsFixed(6)}, ${rep.gps.longitude.toStringAsFixed(6)}'),
            _buildDetailRow('Altitud', '${rep.gps.altitude.round()} m (Precisión: ±${rep.gps.accuracy.toStringAsFixed(1)}m)'),
            _buildDetailRow('Fecha y Hora', DateFormat('dd/MM/yyyy HH:mm:ss').format(rep.createdAt.toLocal())),

            if (rep.fotoLocalPath != null && File(rep.fotoLocalPath!).existsSync()) ...[
              const SizedBox(height: 16),
              const Text('Evidencia Fotográfica', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.primaryLight)),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.file(
                  File(rep.fotoLocalPath!),
                  fit: BoxFit.cover,
                  width: double.infinity,
                  height: 220,
                ),
              ),
            ],
            const SizedBox(height: 18),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.edit_rounded, size: 16),
                    label: const Text('Editar Punto'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.primaryLight,
                      side: const BorderSide(color: AppTheme.primary),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () async {
                      Navigator.pop(ctx);
                      final updated = await Navigator.push<bool>(
                        context,
                        MaterialPageRoute(
                          builder: (c) => SurveyFormScreen(reportToEdit: rep),
                        ),
                      );
                      if (updated == true) {
                        _loadReports();
                      }
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.delete_outline_rounded, size: 16),
                    label: const Text('Quitar Punto'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.danger,
                      side: const BorderSide(color: AppTheme.danger),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: () {
                      Navigator.pop(ctx);
                      _confirmDelete(rep);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cerrar Detalle', style: TextStyle(color: AppTheme.textMuted)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _confirmDelete(SurveyReport rep) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: AppTheme.danger),
            SizedBox(width: 8),
            Text('Eliminar Punto'),
          ],
        ),
        content: Text(
          '¿Desea eliminar permanentemente el reporte ${rep.id}?\n\nEsta acción eliminará el registro del dispositivo y del servidor en producción.',
          style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.danger),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Eliminar', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await DatabaseService.instance.deleteReport(rep.id);
      SyncService.instance.deleteReport(rep.id);
      _loadReports();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.danger,
            content: Text('✓ Reporte ${rep.id} eliminado del dispositivo y del servidor.'),
          ),
        );
      }
    }
  }

  Widget _buildDetailRow(String label, String value) {
    if (value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final myPos = _myLocation != null
        ? LatLng(_myLocation!.latitude, _myLocation!.longitude)
        : const LatLng(5.950149, 15.638896); // Bouar por defecto

    final initialCenter = widget.focusLocation != null
        ? LatLng(widget.focusLocation!.latitude, widget.focusLocation!.longitude)
        : const LatLng(6.6, 18.6);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Visor Cartográfico Valkiria', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.layers_rounded),
            tooltip: 'Control de Capas',
            onPressed: _showLayersModal,
          ),
        ],
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: initialCenter,
              initialZoom: widget.focusLocation != null ? 12.0 : 6.5,
              minZoom: 4.0,
              maxZoom: 16.0,
            ),
            children: [
              // Fondo Táctico Oscuro (Base offline táctica siempre presente)
              Container(color: const Color(0xFF0A0F1D)),

              // Capa Satelital Esri World Imagery (Activa si hay conexión a internet)
              if (_showSatellite)
                TileLayer(
                  urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                  userAgentPackageName: 'pe.gob.idep.valkiria',
                  maxZoom: 19,
                ),

              // Polígonos de Zonas Operativas
              if (_showZonas) PolygonLayer(polygons: _zonasPolygons),

              // Línea de Frontera Nacional RCA
              if (_showRCA) PolylineLayer(polylines: _rcaLines),

              // Aeródromos
              if (_showAirports) MarkerLayer(markers: _airportMarkers),

              // Puntos Registrados en Campo Valkiria
              MarkerLayer(markers: _buildReportMarkers()),

              // Marcador de Posición del Operador en Vivo
              MarkerLayer(
                markers: [
                  Marker(
                    point: myPos,
                    width: 50,
                    height: 50,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppTheme.primaryLight.withOpacity(0.25),
                          ),
                        ),
                        Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppTheme.primary,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Banner del Punto Recién Añadido si aplica
          if (widget.focusReportId != null)
            Positioned(
              top: 16,
              left: 16,
              right: 16,
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    final matches = _reports.where((r) => r.id == widget.focusReportId);
                    if (matches.isNotEmpty) {
                      _showReportDetailsModal(matches.first);
                    }
                  },
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceDark.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFFBBF24)),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.4), blurRadius: 8),
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_rounded, color: Color(0xFFFBBF24), size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text('Punto añadido al mapa táctico', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white)),
                              Text('ID: ${widget.focusReportId} • Toque aquí o en el punto para ver ficha', style: const TextStyle(fontSize: 10, color: AppTheme.primaryLight)),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right_rounded, color: Color(0xFFFBBF24), size: 20),
                      ],
                    ),
                  ),
                ),
              ),
            ),

          // Indicador de Carga
          if (_isLoadingLayers)
            const Positioned(
              bottom: 16,
              left: 16,
              child: Chip(
                backgroundColor: AppTheme.surfaceDark,
                avatar: SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)),
                label: Text('Cargando capas offline...', style: TextStyle(fontSize: 11)),
              ),
            ),

          // Botones Flotantes Tácticos
          Positioned(
            right: 16,
            bottom: 24,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                FloatingActionButton.small(
                  heroTag: 'center_rca',
                  backgroundColor: AppTheme.surfaceDark,
                  onPressed: _centerOnRCA,
                  tooltip: 'Vista General RCA',
                  child: const Icon(Icons.public_rounded, color: Colors.white),
                ),
                const SizedBox(height: 8),
                FloatingActionButton(
                  heroTag: 'my_location',
                  backgroundColor: AppTheme.primary,
                  onPressed: _centerOnMyLocation,
                  tooltip: 'Mi Ubicación GPS',
                  child: const Icon(Icons.my_location_rounded, color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showLayersModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Control de Capas y Mapa Base', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              SwitchListTile(
                value: _showSatellite,
                title: const Text('Mapa Satelital Esri', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                subtitle: const Text('Requiere internet (degrada a táctico si offline)', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                secondary: const Icon(Icons.satellite_alt_rounded, color: Color(0xFF38BDF8)),
                activeColor: const Color(0xFF38BDF8),
                onChanged: (v) {
                  setModalState(() => _showSatellite = v);
                  setState(() => _showSatellite = v);
                },
              ),
              const Divider(color: AppTheme.surfaceElevated),
              SwitchListTile(
                value: _showReports,
                title: const Text('Puntos Registrados en Campo (Valkiria)', style: TextStyle(fontSize: 13)),
                subtitle: Text('${_reports.length} registro(s) almacenado(s)', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                activeColor: const Color(0xFFFBBF24),
                onChanged: (v) {
                  setModalState(() => _showReports = v);
                  setState(() => _showReports = v);
                },
              ),
              SwitchListTile(
                value: _showZonas,
                title: const Text('Zonas de Operación (CENTER, EAST, WEST)', style: TextStyle(fontSize: 13)),
                activeColor: AppTheme.primaryLight,
                onChanged: (v) {
                  setModalState(() => _showZonas = v);
                  setState(() => _showZonas = v);
                },
              ),
              SwitchListTile(
                value: _showRCA,
                title: const Text('Límite Internacional de RCA', style: TextStyle(fontSize: 13)),
                activeColor: const Color(0xFFFF00C5),
                onChanged: (v) {
                  setModalState(() => _showRCA = v);
                  setState(() => _showRCA = v);
                },
              ),
              SwitchListTile(
                value: _showAirports,
                title: const Text('Aeropuertos y Pistas Aéreas', style: TextStyle(fontSize: 13)),
                activeColor: AppTheme.accent,
                onChanged: (v) {
                  setModalState(() => _showAirports = v);
                  setState(() => _showAirports = v);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
