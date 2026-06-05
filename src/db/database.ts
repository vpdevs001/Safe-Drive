/**
 * SQLite database initialization and schema
 * Uses expo-sqlite for persistent local storage
 */

import * as SQLite from "expo-sqlite";

const DB_NAME = "safe_drive.db";
const DB_VERSION = 1;

export interface Database {
  db: SQLite.SQLiteDatabase;
  isInitialized: boolean;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or create the database instance
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await initializeDatabase(dbInstance);
    return dbInstance;
  } catch (error) {
    console.error("Failed to open database:", error);
    throw error;
  }
};

/**
 * Initialize database schema on first run
 */
export const initializeDatabase = async (
  db: SQLite.SQLiteDatabase,
): Promise<void> => {
  try {
    // Enable foreign keys
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // Create sessions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        duration_ms INTEGER,
        score INTEGER DEFAULT 100,
        rating TEXT,
        event_count INTEGER DEFAULT 0,
        name TEXT,
        created_at INTEGER NOT NULL DEFAULT (cast(((julianday('now') - 2440587.5)*86400000) as INTEGER))
      );
    `);

    // Create events table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        occurred_at INTEGER NOT NULL,
        magnitude REAL,
        deduction INTEGER,
        created_at INTEGER NOT NULL DEFAULT (cast(((julianday('now') - 2440587.5)*86400000) as INTEGER))
      );
    `);

    // Create index for faster queries
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
      CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON events(occurred_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    try {
      await dbInstance.closeAsync();
      dbInstance = null;
    } catch (error) {
      console.error("Error closing database:", error);
    }
  }
};

/**
 * Clear all data (for testing/reset)
 */
export const clearDatabase = async (): Promise<void> => {
  const db = await getDatabase();
  try {
    await db.execAsync(`
      DELETE FROM events;
      DELETE FROM sessions;
    `);
    console.log("Database cleared");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
};

/**
 * Get database stats
 */
export const getDatabaseStats = async (): Promise<{
  sessionCount: number;
  eventCount: number;
}> => {
  const db = await getDatabase();
  try {
    const result = await db.getAllAsync(
      "SELECT (SELECT COUNT(*) FROM sessions) as sessions, (SELECT COUNT(*) FROM events) as events",
    );
    const row = (result?.[0] as any) || { sessions: 0, events: 0 };
    return {
      sessionCount: row.sessions || 0,
      eventCount: row.events || 0,
    };
  } catch (error) {
    console.error("Error getting database stats:", error);
    return { sessionCount: 0, eventCount: 0 };
  }
};
