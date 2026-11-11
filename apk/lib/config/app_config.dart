class AppConfig {
  static const String appName = 'Valkiria';
  static const String appVersion = '1.0.0';
  static const String appSubtitle = 'Sistema de Recolección de Campo';

  // Configuración de Servidor REST Valkiria en Producción Oficial (IDEP HTTPS)
  static const String defaultApiUrl = 'https://www.idep.gob.pe/seguimiento/api/sync.php';
  static const String prefApiUrl = 'pref_api_url';

  // Configuración del Ecosistema GitHub Valkiria (100% Serverless)
  static const String githubOwner = 'asleepjk';
  static const String githubRepo = 'Valkiria';
  static const String githubBranch = 'main';

  // Rutas de Destino en el Repositorio
  static const String pathSubmissions = 'data/submissions';
  static const String pathPhotos = 'assets/fotos';
  static const String pathVideos = 'assets/videos';

  // Llaves de SharedPreferences para persistencia
  static const String prefJefeTob = 'pref_jefe_tob';
  static const String prefTelefono = 'pref_telefono';
  static const String prefGithubToken = 'github_pat_token';
  static const String prefAutoSync = 'auto_sync_on_connectivity';

  // Umbrales de Precisión GPS (en metros)
  static const double gpsOptimalAccuracy = 5.0; // Verde
  static const double gpsAcceptableAccuracy = 15.0; // Ámbar

  // Parámetros Multimedia
  static const int photoMaxWidth = 1920;
  static const int photoMaxHeight = 1080;
  static const int photoQuality = 85;

  // Créditos y Autoría
  static const String developerName = 'Ing. Anthony Quispe Espinoza';
  static const String copyrightNotice = 'Desarrollado por Ing. Anthony Quispe Espinoza - Todos los derechos reservados - Lima, Perú';
  static const String contactEmail = 'althair530@gmail.com';
  static const String contactPhone = '+51970465236';
}
