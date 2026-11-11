import 'package:flutter/material.dart';

enum MissionType {
  ingenieria,
  eod,
  novedad;

  String get id {
    switch (this) {
      case MissionType.ingenieria:
        return 'ING';
      case MissionType.eod:
        return 'EOD';
      case MissionType.novedad:
        return 'NOV';
    }
  }

  String get label {
    switch (this) {
      case MissionType.ingenieria:
        return 'Obras de Ingeniería';
      case MissionType.eod:
        return 'Desminado / EOD';
      case MissionType.novedad:
        return 'Novedad / Reconocimiento';
    }
  }

  String get subtitle {
    switch (this) {
      case MissionType.ingenieria:
        return 'Pistas, campamentos, drenajes e infraestructura';
      case MissionType.eod:
        return 'Inspección, remoción y neutralización de artefactos';
      case MissionType.novedad:
        return 'Vías bloqueadas, puentes colapsados o incidentes';
    }
  }

  IconData get icon {
    switch (this) {
      case MissionType.ingenieria:
        return Icons.construction_rounded;
      case MissionType.eod:
        return Icons.warning_amber_rounded;
      case MissionType.novedad:
        return Icons.report_problem_rounded;
    }
  }

  Color get color {
    switch (this) {
      case MissionType.ingenieria:
        return const Color(0xFF0284C7); // Sky 600
      case MissionType.eod:
        return const Color(0xFFEF4444); // Rose 500
      case MissionType.novedad:
        return const Color(0xFFF59E0B); // Amber 500
    }
  }

  static MissionType fromString(String val) {
    switch (val.toUpperCase()) {
      case 'ING':
      case 'INGENIERIA':
        return MissionType.ingenieria;
      case 'EOD':
      case 'DESMINADO':
        return MissionType.eod;
      case 'NOV':
      case 'NOVEDAD':
      default:
        return MissionType.novedad;
    }
  }
}
