import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;
import '../models/survey_report.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._internal();
  static Database? _database;

  DatabaseService._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('valkiria_points.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = p.join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 2,
      onCreate: _createDB,
      onUpgrade: _upgradeDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE survey_reports (
        id TEXT PRIMARY KEY,
        jefe_tob TEXT,
        telefono TEXT,
        lugar_mision TEXT,
        persona TEXT,
        maquinaria TEXT,
        ocurrencias TEXT,
        latitude REAL,
        longitude REAL,
        altitude REAL,
        accuracy REAL,
        heading REAL,
        foto_local TEXT,
        sync_status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        error_message TEXT
      )
    ''');
  }

  Future<void> _upgradeDB(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await db.execute('DROP TABLE IF EXISTS survey_reports');
      await _createDB(db, newVersion);
    }
  }

  // Insertar un nuevo reporte en la base local
  Future<int> insertReport(SurveyReport report) async {
    final db = await database;
    return await db.insert(
      'survey_reports',
      report.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  // Actualizar un reporte existente
  Future<int> updateReport(SurveyReport report) async {
    final db = await database;
    report.updatedAt = DateTime.now();
    return await db.update(
      'survey_reports',
      report.toMap(),
      where: 'id = ?',
      whereArgs: [report.id],
    );
  }

  // Actualizar solo el estado de sincronización
  Future<int> updateSyncStatus(
    String id,
    SyncStatus status, {
    String? errorMessage,
  }) async {
    final db = await database;
    return await db.update(
      'survey_reports',
      {
        'sync_status': status.name,
        'updated_at': DateTime.now().toIso8601String(),
        'error_message': errorMessage,
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Obtener un reporte por su ID
  Future<SurveyReport?> getReportById(String id) async {
    final db = await database;
    final maps = await db.query(
      'survey_reports',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );

    if (maps.isNotEmpty) {
      return SurveyReport.fromMap(maps.first);
    }
    return null;
  }

  // Obtener todos los reportes (con filtro opcional de estado)
  Future<List<SurveyReport>> getAllReports({
    SyncStatus? statusFilter,
    bool includeErrorsForPending = false,
  }) async {
    final db = await database;
    List<Map<String, dynamic>> maps;

    if (includeErrorsForPending && statusFilter == SyncStatus.pending) {
      maps = await db.query(
        'survey_reports',
        where: "sync_status IN ('pending', 'error', 'sending')",
        orderBy: 'created_at DESC',
      );
    } else if (statusFilter != null) {
      maps = await db.query(
        'survey_reports',
        where: 'sync_status = ?',
        whereArgs: [statusFilter.name],
        orderBy: 'created_at DESC',
      );
    } else {
      maps = await db.query(
        'survey_reports',
        orderBy: 'created_at DESC',
      );
    }

    return maps.map((m) => SurveyReport.fromMap(m)).toList();
  }

  // Contar reportes pendientes en Bandeja de Salida (Outbox)
  Future<int> getPendingCount() async {
    final db = await database;
    final result = await db.rawQuery(
      "SELECT COUNT(*) as count FROM survey_reports WHERE sync_status IN ('pending', 'error')",
    );
    return Sqflite.firstIntValue(result) ?? 0;
  }

  // Eliminar un reporte
  Future<int> deleteReport(String id) async {
    final db = await database;
    return await db.delete(
      'survey_reports',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> close() async {
    final db = await database;
    await db.close();
  }
}
