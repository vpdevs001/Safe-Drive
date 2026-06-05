/**
 * Session Repository
 * Handles all CRUD operations for drive sessions
 */

import { DriveSession, RatingType } from "../types/session";
import { getDatabase } from "./database";

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Create a new drive session
 */
export const createSession = async (
  overrides?: Partial<DriveSession>,
): Promise<DriveSession> => {
  const db = await getDatabase();
  const id = generateId();
  const now = Date.now();

  const session: DriveSession = {
    id,
    startedAt: overrides?.startedAt ?? now,
    score: 100,
    eventCount: 0,
    createdAt: now,
    ...overrides,
  };

  try {
    await db.runAsync(
      `INSERT INTO sessions (id, started_at, score, event_count, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        session.id,
        session.startedAt,
        session.score,
        session.eventCount,
        session.createdAt,
      ],
    );
    return session;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

/**
 * Get session by ID
 */
export const getSessionById = async (
  sessionId: string,
): Promise<DriveSession | null> => {
  const db = await getDatabase();
  try {
    const result = await db.getFirstAsync<any>(
      `SELECT * FROM sessions WHERE id = ?`,
      [sessionId],
    );

    if (!result) return null;

    return mapRowToSession(result);
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

/**
 * Get all sessions, ordered by start time (newest first)
 */
export const getAllSessions = async (): Promise<DriveSession[]> => {
  const db = await getDatabase();
  try {
    const results = await db.getAllAsync<any>(
      `SELECT * FROM sessions ORDER BY started_at DESC`,
    );
    return results.map(mapRowToSession);
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    throw error;
  }
};

/**
 * Get sessions with pagination
 */
export const getSessionsPaginated = async (
  limit: number = 20,
  offset: number = 0,
): Promise<{
  sessions: DriveSession[];
  total: number;
}> => {
  const db = await getDatabase();
  try {
    const results = await db.getAllAsync<any>(
      `SELECT * FROM sessions ORDER BY started_at DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    const countResult = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM sessions`,
    );

    return {
      sessions: results.map(mapRowToSession),
      total: countResult?.count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching paginated sessions:", error);
    throw error;
  }
};

/**
 * Update session (mainly used to finalize session on end drive)
 */
export const updateSession = async (
  sessionId: string,
  updates: Partial<DriveSession>,
): Promise<DriveSession | null> => {
  const db = await getDatabase();
  try {
    const setClauses: string[] = [];
    const values: any[] = [];

    if (updates.endedAt !== undefined) {
      setClauses.push("ended_at = ?");
      values.push(updates.endedAt);
    }
    if (updates.durationMs !== undefined) {
      setClauses.push("duration_ms = ?");
      values.push(updates.durationMs);
    }
    if (updates.score !== undefined) {
      setClauses.push("score = ?");
      values.push(updates.score);
    }
    if (updates.rating !== undefined) {
      setClauses.push("rating = ?");
      values.push(updates.rating);
    }
    if (updates.eventCount !== undefined) {
      setClauses.push("event_count = ?");
      values.push(updates.eventCount);
    }
    if (updates.name !== undefined) {
      setClauses.push("name = ?");
      values.push(updates.name);
    }

    if (setClauses.length === 0) {
      return getSessionById(sessionId);
    }

    values.push(sessionId);

    await db.runAsync(
      `UPDATE sessions SET ${setClauses.join(", ")} WHERE id = ?`,
      values,
    );

    return getSessionById(sessionId);
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

/**
 * Delete session and all associated events
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  const db = await getDatabase();
  try {
    await db.runAsync(`DELETE FROM sessions WHERE id = ?`, [sessionId]);
    console.log(`Session ${sessionId} deleted`);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

/**
 * Get sessions from a specific date range
 */
export const getSessionsByDateRange = async (
  startMs: number,
  endMs: number,
): Promise<DriveSession[]> => {
  const db = await getDatabase();
  try {
    const results = await db.getAllAsync<any>(
      `SELECT * FROM sessions 
       WHERE started_at >= ? AND started_at <= ? 
       ORDER BY started_at DESC`,
      [startMs, endMs],
    );
    return results.map(mapRowToSession);
  } catch (error) {
    console.error("Error fetching sessions by date range:", error);
    throw error;
  }
};

/**
 * Get aggregate stats for all sessions
 */
export const getSessionStats = async (): Promise<{
  totalSessions: number;
  totalDurationMs: number;
  averageScore: number;
  totalEvents: number;
  bestScore: number;
  worstScore: number;
}> => {
  const db = await getDatabase();
  try {
    const result = await db.getFirstAsync<any>(
      `SELECT
        COUNT(*) as total_sessions,
        COALESCE(SUM(duration_ms), 0) as total_duration_ms,
        COALESCE(AVG(score), 0) as average_score,
        COALESCE(SUM(event_count), 0) as total_events,
        COALESCE(MAX(score), 0) as best_score,
        COALESCE(MIN(score), 0) as worst_score
       FROM sessions
       WHERE ended_at IS NOT NULL`,
    );

    return {
      totalSessions: result?.total_sessions ?? 0,
      totalDurationMs: result?.total_duration_ms ?? 0,
      averageScore: Math.round((result?.average_score ?? 0) * 100) / 100,
      totalEvents: result?.total_events ?? 0,
      bestScore: result?.best_score ?? 0,
      worstScore: result?.worst_score ?? 0,
    };
  } catch (error) {
    console.error("Error fetching session stats:", error);
    throw error;
  }
};

/**
 * Helper: Map database row to DriveSession type
 */
const mapRowToSession = (row: any): DriveSession => ({
  id: row.id,
  startedAt: row.started_at,
  endedAt: row.ended_at,
  durationMs: row.duration_ms,
  score: row.score ?? 100,
  rating: row.rating as RatingType | undefined,
  eventCount: row.event_count ?? 0,
  name: row.name,
  createdAt: row.created_at,
});
