import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import '../config/app_config.dart';
import '../config/app_theme.dart';
import '../models/gps_location.dart';
import '../models/survey_report.dart';
import '../services/camera_service.dart';
import '../services/database_service.dart';
import '../services/gps_service.dart';
import '../services/sync_service.dart';
import '../widgets/accuracy_badge.dart';
import 'minimap_screen.dart';

class SurveyFormScreen extends StatefulWidget {
  final SurveyReport? reportToEdit;

  const SurveyFormScreen({super.key, this.reportToEdit});

  @override
  State<SurveyFormScreen> createState() => _SurveyFormScreenState();
}

class _SurveyFormScreenState extends State<SurveyFormScreen> {
  final _formKey = GlobalKey<FormState>();

  // Text Controllers para los 6 campos del formulario
  final _jefeTobCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _lugarMisionCtrl = TextEditingController();
  final _personaCtrl = TextEditingController();
  final _maquinariaCtrl = TextEditingController();
  final _ocurrenciasCtrl = TextEditingController();

  GPSLocation? _gps;
  bool _isLoadingGPS = false;

  String? _fotoLocalPath;
  bool _isSaving = false;
  late String _reportId;

  bool get _isEditing => widget.reportToEdit != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      final rep = widget.reportToEdit!;
      _reportId = rep.id;
      _jefeTobCtrl.text = rep.jefeTob;
      _telefonoCtrl.text = rep.telefono;
      _lugarMisionCtrl.text = rep.lugarMision;
      _personaCtrl.text = rep.persona;
      _maquinariaCtrl.text = rep.maquinaria;
      _ocurrenciasCtrl.text = rep.ocurrencias;
      _gps = rep.gps;
      _fotoLocalPath = rep.fotoLocalPath;
    } else {
      _generateReportId();
      _loadSavedDefaults();
      _captureCurrentGPS();
    }
  }

  @override
  void dispose() {
    _jefeTobCtrl.dispose();
    _telefonoCtrl.dispose();
    _lugarMisionCtrl.dispose();
    _personaCtrl.dispose();
    _maquinariaCtrl.dispose();
    _ocurrenciasCtrl.dispose();
    super.dispose();
  }

  void _generateReportId() {
    final now = DateTime.now();
    final dateStr = DateFormat('yyyyMMdd').format(now);
    final shortUuid = const Uuid().v4().substring(0, 4).toUpperCase();
    _reportId = 'VAL-$dateStr-$shortUuid';
  }

  Future<void> _loadSavedDefaults() async {
    final prefs = await SharedPreferences.getInstance();
    final savedJefe = prefs.getString(AppConfig.prefJefeTob) ?? '';
    final savedTel = prefs.getString(AppConfig.prefTelefono) ?? '';

    if (savedJefe.isNotEmpty) _jefeTobCtrl.text = savedJefe;
    if (savedTel.isNotEmpty) _telefonoCtrl.text = savedTel;
  }

  Future<void> _captureCurrentGPS() async {
    setState(() => _isLoadingGPS = true);
    final pos = await GPSService.instance.getCurrentPosition();
    if (mounted) {
      setState(() {
        _gps = pos;
        _isLoadingGPS = false;
      });
    }
  }

  Future<void> _pickPhoto(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (picked != null) {
        final gpsToUse = _gps ?? GPSLocation.mockBouar();
        final watermarkedPath = await CameraService.instance.processAndWatermarkPhoto(
          rawImagePath: picked.path,
          reportId: _reportId,
          gps: gpsToUse,
          operatorName: _jefeTobCtrl.text.trim().isNotEmpty ? _jefeTobCtrl.text.trim() : 'TOB',
          photoIndex: 1,
        );

        setState(() {
          _fotoLocalPath = watermarkedPath;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(backgroundColor: AppTheme.danger, content: Text('Error al capturar foto: $e')),
        );
      }
    }
  }

  Future<void> _saveAndShowOnMap() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.warning,
          content: Text('Por favor complete los campos obligatorios.'),
        ),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      // 1. Guardar datos en SharedPreferences para autocompletado en el siguiente reporte
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConfig.prefJefeTob, _jefeTobCtrl.text.trim());
      await prefs.setString(AppConfig.prefTelefono, _telefonoCtrl.text.trim());

      // 2. Asegurar coordenadas GPS
      final gpsToSave = _gps ?? await GPSService.instance.getCurrentPosition();

      // 3. Crear o actualizar el objeto SurveyReport estandarizado
      final now = DateTime.now();
      final report = SurveyReport(
        id: _reportId,
        jefeTob: _jefeTobCtrl.text.trim(),
        telefono: _telefonoCtrl.text.trim(),
        lugarMision: _lugarMisionCtrl.text.trim(),
        persona: _personaCtrl.text.trim(),
        maquinaria: _maquinariaCtrl.text.trim(),
        ocurrencias: _ocurrenciasCtrl.text.trim(),
        gps: gpsToSave,
        fotoLocalPath: _fotoLocalPath,
        syncStatus: SyncStatus.pending,
        createdAt: _isEditing ? widget.reportToEdit!.createdAt : now,
        updatedAt: now,
      );

      // 4. Guardar en SQLite Local (Outbox offline garantizada)
      if (_isEditing) {
        await DatabaseService.instance.updateReport(report);
      } else {
        await DatabaseService.instance.insertReport(report);
      }

      // 5. Intentar sincronización en background si hay conectividad
      SyncService.instance.syncReport(report);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.accent,
            duration: const Duration(seconds: 2),
            content: Text(_isEditing 
                ? '✓ Reporte $_reportId actualizado correctamente.' 
                : '✓ Reporte $_reportId guardado. Mostrando en el mapa...'),
          ),
        );

        if (_isEditing) {
          Navigator.pop(context, true);
        } else {
          // 6. Redirigir de inmediato al Minimapa Táctico enfocando el nuevo punto
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (ctx) => MinimapScreen(
                focusReportId: report.id,
                focusLocation: report.gps,
              ),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(backgroundColor: AppTheme.danger, content: Text('Error al guardar reporte: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_isEditing ? 'Editar Registro de Campo' : 'Nuevo Registro de Campo',
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            Text(
              'ID: $_reportId',
              style: const TextStyle(fontSize: 11, color: AppTheme.primaryLight, fontFamily: 'monospace'),
            ),
          ],
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 1. Tarjeta GPS en Tiempo Real
            _buildGPSSection(),
            const SizedBox(height: 16),

            // 2. Bloque de Datos Operativos (7 Campos)
            _buildFormCard(),
            const SizedBox(height: 16),

            // 3. Captura Fotográfica
            _buildPhotoSection(),
            const SizedBox(height: 24),

            // 4. Botón de Acción Principal: GUARDAR / ACTUALIZAR
            SizedBox(
              height: 52,
              child: ElevatedButton.icon(
                icon: _isSaving
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : Icon(_isEditing ? Icons.check_circle_rounded : Icons.map_rounded, size: 22),
                label: Text(
                  _isSaving
                      ? 'GUARDANDO CAMBIOS...'
                      : (_isEditing ? 'ACTUALIZAR REGISTRO' : 'GUARDAR Y VER EN EL MAPA'),
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                ),
                onPressed: _isSaving ? null : _saveAndShowOnMap,
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildGPSSection() {
    final gps = _gps ?? GPSLocation.mockBouar();

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
                        'POSICIÓN GEORREFERENCIADA',
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
          const SizedBox(height: 10),
          Text(
            gps.toDMS(),
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'monospace', color: Colors.white),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'DD: ${gps.toDD()} | Alt: ${gps.altitude.round()} m',
                style: const TextStyle(fontSize: 11, color: AppTheme.textMuted, fontFamily: 'monospace'),
              ),
              IconButton(
                icon: _isLoadingGPS
                    ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.my_location_rounded, size: 18, color: AppTheme.primaryLight),
                tooltip: 'Actualizar GPS',
                onPressed: _isLoadingGPS ? null : _captureCurrentGPS,
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFormCard() {
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
              Icon(Icons.edit_note_rounded, size: 18, color: AppTheme.primaryLight),
              SizedBox(width: 8),
              Text('DATOS DEL FORMULARIO DE CAMPO', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: AppTheme.textSecondary)),
            ],
          ),
          const SizedBox(height: 16),

          // 1. Jefe de TOB
          TextFormField(
            controller: _jefeTobCtrl,
            decoration: const InputDecoration(
              labelText: 'Jefe de TOB *',
              hintText: 'Ej. Cap. Pérez / Tte. Mendoza',
              prefixIcon: Icon(Icons.person_pin_rounded, size: 20),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Ingrese el Jefe de TOB' : null,
          ),
          const SizedBox(height: 14),

          // 2. Teléfono (Numérico)
          TextFormField(
            controller: _telefonoCtrl,
            keyboardType: TextInputType.phone,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            decoration: const InputDecoration(
              labelText: 'Teléfono *',
              hintText: 'Ej. 970465236',
              prefixIcon: Icon(Icons.phone_rounded, size: 20),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Ingrese el número de teléfono' : null,
          ),
          const SizedBox(height: 14),

          // 3. Lugar de Misión
          TextFormField(
            controller: _lugarMisionCtrl,
            decoration: const InputDecoration(
              labelText: 'Lugar de Misión *',
              hintText: 'Ej. Bouar Sector 4 / Base Avanzada',
              prefixIcon: Icon(Icons.place_rounded, size: 20),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Ingrese el lugar de la misión' : null,
          ),
          const SizedBox(height: 14),

          // 4. Personal
          TextFormField(
            controller: _personaCtrl,
            decoration: const InputDecoration(
              labelText: 'Personal *',
              hintText: 'Ej. Personal de contacto / operador asignado',
              prefixIcon: Icon(Icons.people_alt_rounded, size: 20),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Ingrese el personal relacionado' : null,
          ),
          const SizedBox(height: 14),

          // 5. Maquinaria
          TextFormField(
            controller: _maquinariaCtrl,
            decoration: const InputDecoration(
              labelText: 'Maquinaria *',
              hintText: 'Ej. Tractor Oruga CAT D6 / Retroexcavadora',
              prefixIcon: Icon(Icons.precision_manufacturing_rounded, size: 20),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Ingrese la maquinaria' : null,
          ),
          const SizedBox(height: 14),

          // 6. Ocurrencias
          TextFormField(
            controller: _ocurrenciasCtrl,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Ocurrencias *',
              hintText: 'Detalle de novedades, avance operativo y observaciones en campo...',
              alignLabelWithHint: true,
              prefixIcon: Icon(Icons.notes_rounded, size: 20),
            ),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Ingrese las ocurrencias registradas' : null,
          ),
        ],
      ),
    );
  }

  Widget _buildPhotoSection() {
    final hasPhoto = _fotoLocalPath != null && File(_fotoLocalPath!).existsSync();

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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.camera_alt_rounded, size: 18, color: AppTheme.primaryLight),
                  SizedBox(width: 8),
                  Text('EVIDENCIA FOTOGRÁFICA', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: AppTheme.textSecondary)),
                ],
              ),
              Text('(Con marca pericial)', style: TextStyle(fontSize: 10, color: AppTheme.textMuted)),
            ],
          ),
          const SizedBox(height: 14),

          if (hasPhoto) ...[
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.file(
                    File(_fotoLocalPath!),
                    fit: BoxFit.cover,
                    width: double.infinity,
                    height: 200,
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: CircleAvatar(
                    backgroundColor: Colors.black54,
                    child: IconButton(
                      icon: const Icon(Icons.delete_outline_rounded, color: AppTheme.danger),
                      onPressed: () => setState(() => _fotoLocalPath = null),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
          ],

          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.camera_rounded, size: 18),
                  label: Text(hasPhoto ? 'Retomar con Cámara' : 'Tomar Foto'),
                  onPressed: () => _pickPhoto(ImageSource.camera),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.photo_library_rounded, size: 18),
                  label: const Text('De Galería'),
                  onPressed: () => _pickPhoto(ImageSource.gallery),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
