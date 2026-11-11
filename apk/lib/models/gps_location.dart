enum GPSQuality { optimal, acceptable, poor }

class GPSLocation {
  final double latitude;
  final double longitude;
  final double altitude;
  final double accuracy;
  final double heading;
  final DateTime timestamp;

  GPSLocation({
    required this.latitude,
    required this.longitude,
    required this.altitude,
    required this.accuracy,
    required this.heading,
    required this.timestamp,
  });

  GPSQuality get quality {
    if (accuracy <= 5.0) return GPSQuality.optimal;
    if (accuracy <= 15.0) return GPSQuality.acceptable;
    return GPSQuality.poor;
  }

  // Grados Decimales formateados
  String toDD() {
    final latDir = latitude >= 0 ? 'N' : 'S';
    final lonDir = longitude >= 0 ? 'E' : 'W';
    return '${latitude.abs().toStringAsFixed(5)}° $latDir, ${longitude.abs().toStringAsFixed(5)}° $lonDir';
  }

  // Grados, Minutos y Segundos (DMS) militar
  String toDMS() {
    return '${_formatSingleDMS(latitude, true)}  ${_formatSingleDMS(longitude, false)}';
  }

  String _formatSingleDMS(double val, bool isLat) {
    final absVal = val.abs();
    final deg = absVal.floor();
    final minNotTrunc = (absVal - deg) * 60;
    final min = minNotTrunc.floor();
    final sec = ((minNotTrunc - min) * 60).round();
    final dir = val >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
    final degStr = deg.toString().padLeft(isLat ? 2 : 3, '0');
    final minStr = min.toString().padLeft(2, '0');
    final secStr = sec.toString().padLeft(2, '0');
    return '$degStr°$minStr\'$secStr"$dir';
  }

  // Conversión militar aproximada UTM / MGRS de referencia táctica
  String toTacticalCoords() {
    return 'DMS: ${toDMS()} | Alt: ${altitude.round()}m (±${accuracy.toStringAsFixed(1)}m)';
  }

  Map<String, dynamic> toMap() {
    return {
      'latitude': latitude,
      'longitude': longitude,
      'altitude': altitude,
      'accuracy': accuracy,
      'heading': heading,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory GPSLocation.fromMap(Map<String, dynamic> map) {
    return GPSLocation(
      latitude: (map['latitude'] as num).toDouble(),
      longitude: (map['longitude'] as num).toDouble(),
      altitude: (map['altitude'] as num?)?.toDouble() ?? 0.0,
      accuracy: (map['accuracy'] as num?)?.toDouble() ?? 0.0,
      heading: (map['heading'] as num?)?.toDouble() ?? 0.0,
      timestamp: DateTime.tryParse(map['timestamp'] ?? '') ?? DateTime.now(),
    );
  }

  factory GPSLocation.mockBouar() {
    return GPSLocation(
      latitude: 5.950149,
      longitude: 15.638896,
      altitude: 624.0,
      accuracy: 3.2,
      heading: 0.0,
      timestamp: DateTime.now(),
    );
  }
}
