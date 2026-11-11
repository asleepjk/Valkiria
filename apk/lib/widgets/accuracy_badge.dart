import 'package:flutter/material.dart';
import '../models/gps_location.dart';

class AccuracyBadge extends StatelessWidget {
  final GPSLocation gps;
  final VoidCallback? onTap;

  const AccuracyBadge({
    super.key,
    required this.gps,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Color badgeColor;
    String label;
    IconData icon;

    switch (gps.quality) {
      case GPSQuality.optimal:
        badgeColor = const Color(0xFF10B981); // Emerald
        label = 'Óptimo ±${gps.accuracy.toStringAsFixed(1)}m';
        icon = Icons.gps_fixed_rounded;
        break;
      case GPSQuality.acceptable:
        badgeColor = const Color(0xFFF59E0B); // Amber
        label = 'Aceptable ±${gps.accuracy.toStringAsFixed(1)}m';
        icon = Icons.gps_not_fixed_rounded;
        break;
      case GPSQuality.poor:
        badgeColor = const Color(0xFFEF4444); // Rose
        label = 'Débil ±${gps.accuracy.toStringAsFixed(1)}m';
        icon = Icons.gps_off_rounded;
        break;
    }

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: badgeColor.withOpacity(0.12),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: badgeColor.withOpacity(0.4),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 13, color: badgeColor),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: badgeColor,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                fontFamily: 'monospace',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
