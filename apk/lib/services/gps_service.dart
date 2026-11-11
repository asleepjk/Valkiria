import 'dart:async';
import 'package:geolocator/geolocator.dart';
import '../models/gps_location.dart';

class GPSService {
  static final GPSService instance = GPSService._internal();
  GPSService._internal();

  StreamController<GPSLocation>? _streamController;
  StreamSubscription<Position>? _positionSubscription;

  // Verificar y solicitar permisos de ubicación
  Future<bool> handleLocationPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return false;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return false;
    }

    return true;
  }

  // Obtener la posición actual con máxima precisión
  Future<GPSLocation> getCurrentPosition() async {
    final hasPermission = await handleLocationPermission();

    if (!hasPermission) {
      // Coordenadas tácticas de Bouar, RCA como valor por defecto si no hay GPS
      return GPSLocation.mockBouar();
    }

    try {
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.bestForNavigation,
          timeLimit: Duration(seconds: 10),
        ),
      );

      return GPSLocation(
        latitude: pos.latitude,
        longitude: pos.longitude,
        altitude: pos.altitude,
        accuracy: pos.accuracy,
        heading: pos.heading,
        timestamp: pos.timestamp,
      );
    } catch (e) {
      // Fallback a última ubicación conocida o Bouar
      final lastPos = await Geolocator.getLastKnownPosition();
      if (lastPos != null) {
        return GPSLocation(
          latitude: lastPos.latitude,
          longitude: lastPos.longitude,
          altitude: lastPos.altitude,
          accuracy: lastPos.accuracy,
          heading: lastPos.heading,
          timestamp: lastPos.timestamp,
        );
      }
      return GPSLocation.mockBouar();
    }
  }

  // Stream continuo de posición para el minimapa y velocímetro/brújula
  Stream<GPSLocation> get positionStream {
    _streamController ??= StreamController<GPSLocation>.broadcast(
      onListen: _startListening,
      onCancel: _stopListening,
    );
    return _streamController!.stream;
  }

  void _startListening() async {
    final hasPermission = await handleLocationPermission();
    if (!hasPermission) {
      _streamController?.add(GPSLocation.mockBouar());
      return;
    }

    const locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 3, // Actualizar cada 3 metros de desplazamiento
    );

    _positionSubscription = Geolocator.getPositionStream(
      locationSettings: locationSettings,
    ).listen(
      (Position pos) {
        _streamController?.add(
          GPSLocation(
            latitude: pos.latitude,
            longitude: pos.longitude,
            altitude: pos.altitude,
            accuracy: pos.accuracy,
            heading: pos.heading,
            timestamp: pos.timestamp,
          ),
        );
      },
      onError: (err) {
        _streamController?.add(GPSLocation.mockBouar());
      },
    );
  }

  void _stopListening() {
    _positionSubscription?.cancel();
    _positionSubscription = null;
  }

  void dispose() {
    _stopListening();
    _streamController?.close();
    _streamController = null;
  }
}
