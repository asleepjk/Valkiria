import 'dart:io';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../config/app_theme.dart';
import '../models/survey_report.dart';
import '../services/database_service.dart';
import '../services/sync_service.dart';
import 'minimap_screen.dart';
import 'survey_form_screen.dart';

class OutboxScreen extends StatefulWidget {
  const OutboxScreen({super.key});

  @override
  State<OutboxScreen> createState() => _OutboxScreenState();
}

class _OutboxScreenState extends State<OutboxScreen> {
  List<SurveyReport> _reports = [];
  bool _isLoading = true;
  bool _isSyncing = false;
  String _currentFilter = 'pending'; // 'pending', 'sent', 'all'

  @override
  void initState() {
    super.initState();
    _loadReports();
  }

  Future<void> _loadReports() async {
    setState(() => _isLoading = true);
    SyncStatus? filter;
    bool includeErrors = false;
    if (_currentFilter == 'pending') {
      filter = SyncStatus.pending;
      includeErrors = true;
    } else if (_currentFilter == 'sent') {
      filter = SyncStatus.sent;
    }

    final reps = await DatabaseService.instance.getAllReports(
      statusFilter: filter,
      includeErrorsForPending: includeErrors,
    );
    if (mounted) {
      setState(() {
        _reports = reps;
        _isLoading = false;
      });
    }
  }

  Future<void> _syncAll() async {
    setState(() => _isSyncing = true);
    final count = await SyncService.instance.syncAllPending();
    if (mounted) {
      setState(() => _isSyncing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppTheme.accent,
          content: Text('✓ Sincronización finalizada. $count reporte(s) transmitido(s).'),
        ),
      );
      _loadReports();
    }
  }

  Future<void> _retrySingle(SurveyReport rep) async {
    setState(() => _isSyncing = true);
    final ok = await SyncService.instance.syncReport(rep);
    if (mounted) {
      setState(() => _isSyncing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: ok ? AppTheme.accent : AppTheme.danger,
          content: Text(ok ? '✓ Reporte ${rep.id} transmitido exitosamente.' : 'Error al transmitir reporte ${rep.id}.'),
        ),
      );
      _loadReports();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bandeja de Salida', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Recargar lista',
            onPressed: _loadReports,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filtros Superiores
          Container(
            color: AppTheme.surfaceDark,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _buildFilterChip('Pendientes', 'pending'),
                const SizedBox(width: 8),
                _buildFilterChip('Enviados', 'sent'),
                const SizedBox(width: 8),
                _buildFilterChip('Todos', 'all'),
              ],
            ),
          ),

          // Lista de Reportes
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _reports.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              _currentFilter == 'pending' ? Icons.check_circle_outline_rounded : Icons.inbox_rounded,
                              size: 48,
                              color: AppTheme.textMuted,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              _currentFilter == 'pending'
                                  ? 'No hay reportes pendientes en la bandeja de salida.'
                                  : 'No se encontraron registros.',
                              style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _reports.length,
                        itemBuilder: (ctx, index) => _buildReportCard(_reports[index]),
                      ),
          ),

          // Barra Inferior de Sincronización
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppTheme.surfaceDark,
              border: Border(top: BorderSide(color: AppTheme.surfaceElevated)),
            ),
            child: SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                icon: _isSyncing
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.cloud_upload_rounded),
                label: const Text('SINCRONIZAR BANDEJA AHORA'),
                onPressed: _isSyncing ? null : _syncAll,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String key) {
    final isSelected = _currentFilter == key;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 12, color: isSelected ? Colors.white : AppTheme.textSecondary)),
      selected: isSelected,
      selectedColor: AppTheme.primary,
      backgroundColor: AppTheme.surface,
      onSelected: (val) {
        if (val) {
          setState(() => _currentFilter = key);
          _loadReports();
        }
      },
    );
  }

  Widget _buildReportCard(SurveyReport rep) {
    Color statusColor;
    IconData statusIcon;

    switch (rep.syncStatus) {
      case SyncStatus.sent:
        statusColor = AppTheme.accent;
        statusIcon = Icons.done_all_rounded;
        break;
      case SyncStatus.sending:
        statusColor = AppTheme.primaryLight;
        statusIcon = Icons.sync_rounded;
        break;
      case SyncStatus.error:
        statusColor = AppTheme.danger;
        statusIcon = Icons.error_outline_rounded;
        break;
      case SyncStatus.pending:
      default:
        statusColor = AppTheme.warning;
        statusIcon = Icons.schedule_rounded;
        break;
    }

    final dateFormatted = DateFormat('dd/MM/yyyy HH:mm').format(rep.createdAt.toLocal());

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (ctx) => MinimapScreen(
                focusReportId: rep.id,
                focusLocation: rep.gps,
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Cabecera de Tarjeta
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppTheme.primary.withOpacity(0.5)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.shield_rounded, size: 12, color: AppTheme.primaryLight),
                            SizedBox(width: 4),
                            Text(
                              'VALKIRIA',
                              style: TextStyle(color: AppTheme.primaryLight, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        rep.id,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'monospace'),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(statusIcon, size: 12, color: statusColor),
                        const SizedBox(width: 4),
                        Text(
                          rep.syncStatus.label,
                          style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Lugar de Misión
              Text(
                'Lugar: ${rep.lugarMision}',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 4),
              Text(
                'Jefe TOB: ${rep.jefeTob} | Tel: ${rep.telefono}',
                style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 2),
              Text(
                'Personal: ${rep.persona} | Maquinaria: ${rep.maquinaria}',
                style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
              ),
              if (rep.ocurrencias.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  'Ocurrencias: ${rep.ocurrencias}',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 11, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
                ),
              ],
              const SizedBox(height: 6),
              Text(
                'GPS: ${rep.gps.toDMS()} (±${rep.gps.accuracy.toStringAsFixed(1)}m)',
                style: const TextStyle(fontSize: 10, color: AppTheme.textMuted, fontFamily: 'monospace'),
              ),

              if (rep.errorMessage != null && rep.errorMessage!.isNotEmpty) ...[
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppTheme.danger.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'Error: ${rep.errorMessage}',
                    style: const TextStyle(color: AppTheme.danger, fontSize: 10),
                  ),
                ),
              ],

              const SizedBox(height: 10),
              const Divider(height: 1, color: AppTheme.surfaceElevated),
              const SizedBox(height: 8),

              // Miniatura de evidencia y botones
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      if (rep.fotoLocalPath != null && File(rep.fotoLocalPath!).existsSync()) ...[
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: Image.file(File(rep.fotoLocalPath!), width: 38, height: 38, fit: BoxFit.cover),
                        ),
                        const SizedBox(width: 8),
                      ],
                      const Text('Ver en mapa', style: TextStyle(fontSize: 11, color: AppTheme.primaryLight, fontWeight: FontWeight.bold)),
                      const Icon(Icons.chevron_right_rounded, size: 16, color: AppTheme.primaryLight),
                    ],
                  ),
                  Row(
                    children: [
                      Text(dateFormatted, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
                      const SizedBox(width: 4),
                      IconButton(
                        icon: const Icon(Icons.edit_rounded, size: 16, color: AppTheme.primaryLight),
                        tooltip: 'Editar reporte',
                        visualDensity: VisualDensity.compact,
                        onPressed: () async {
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
                      IconButton(
                        icon: const Icon(Icons.delete_outline_rounded, size: 16, color: AppTheme.danger),
                        tooltip: 'Quitar reporte',
                        visualDensity: VisualDensity.compact,
                        onPressed: () => _confirmDelete(rep),
                      ),
                      if (rep.syncStatus != SyncStatus.sent)
                        IconButton(
                          icon: const Icon(Icons.send_rounded, size: 16, color: AppTheme.primaryLight),
                          tooltip: 'Reintentar transmisión',
                          visualDensity: VisualDensity.compact,
                          onPressed: _isSyncing ? null : () => _retrySingle(rep),
                        ),
                    ],
                  ),
                ],
              ),
            ],
          ),
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
            content: Text('✓ Reporte ${rep.id} eliminado.'),
          ),
        );
      }
    }
  }
}
