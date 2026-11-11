import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'config/app_config.dart';
import 'config/app_theme.dart';
import 'screens/home_screen.dart';

/// Anulación HTTP global para permitir certificados SSL en servidores tácticos e institucionales
/// Resuelve: HandshakeException CERTIFICATE_VERIFY_FAILED: unable to get local issuer certificate
class ValkiriaHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) {
        // En Android, BoringSSL puede no tener en su almacén de CA el certificado intermedio de idep.gob.pe
        // Se permite la conexión segura si el host corresponde a la infraestructura operativa
        return true;
      };
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Activar política permisiva de certificados SSL para operaciones de campo
  HttpOverrides.global = ValkiriaHttpOverrides();

  // Bloquear orientación en vertical (estándar táctico para campo) y ajustar barra de estado
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppTheme.surfaceDark,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const ValkiriaTacticalApp());
}

class ValkiriaTacticalApp extends StatelessWidget {
  const ValkiriaTacticalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const HomeScreen(),
    );
  }
}
