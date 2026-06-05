/**
 * Event Repository
 * Handles all CRUD operations for drive events
 */

import { v4 as uuidv4 } from "uuid";
import { DriveEvent, EventType } from "../types/session";
import { getDatabase } from "./database";

/**
 * Create a new event
 */
export const createEvent = async (
  overrides?: Partial<DriveEvent>,
): Promise<DriveEvent> => {
  const db = await getDatabase();
  const id = uuidv4();
  const now = Date.now();

  if (!overrides?.sessionId) {
    throw new Error("sessionId is required");
  }
  if (!overrides?.type) {
    throw new Error("type is required");
  }

  const event: DriveEvent = {
    id,
    sessionId: overrides.sessionId,
    type: overrides.type,
    occurredAt: overrides.occurredAt ?? now,
    magnitude: overrides.magnitude ?? 0,
    deduction: overrides.deduction ?? 0,
    createdAt: now,
  };

  try {
    await db.runAsync(
      `INSERT INTO events (id, session_id, type, occurred_at, magnitude, deduction, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.id,
        event.sessionId,
        event.type,
        event.occurredAt,
        event.magnitude,
        event.deduction,
        event.createdAt,
      ],
    );
    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

/**
 * Create multiple events in batch (more efficient)
 */
export const createEventsBatch = async (
  events: Partial<DriveEvent>[],
): Promise<DriveEvent[]> => {
  const db = await getDatabase();
  const now = Date.now();
  const createdEvents: DriveEvent[] = [];

  try {
    for (const eventOverride of events) {
      if (!eventOverride.sessionId) {
        console.warn("Skipping event: sessionId is required");
        continue;
      }
      if (!eventOverride.type) {
        console.warn("Skipping event: type is required");
        continue;
      }

      const event: DriveEvent = {
        id: uuidv4(),
        sessionId: eventOverride.sessionId,
        type: eventOverride.type,
        occurredAt: eventOverride.occurredAt ?? now,
        magnitude: eventOverride.magnitude ?? 0,
        deduction: eventOverride.deduction ?? 0,
        createdAt: now,
      };

      await db.runAsync(
        `INSERT INTO events (id, session_id, type, occurred_at, magnitude, deduction, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.sessionId,
          event.type,
          event.occurredAt,
          event.magnitude,
          event.deduction,
          event.createdAt,
        ],
      );

      createdEvents.push(event);
    }
    return createdEvents;
  } catch (error) {
    console.error("Error creating events batch:", error);
    throw error;
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (
  eventId: string,
): Promise<DriveEvent | null> => {
  const db = await getDatabase();
  try {
    const result = await db.getFirstAsync<any>(
      `SELECT * FROM events WHERE id = ?`,
      [eventId],
    );

    if (!result) return null;

    return mapRowToEvent(result);
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

/**
 * Get all events for a session
 */
export const getEventsBySessionId = async (
  sessionId: string,
): Promise<DriveEvent[]> => {
  const db = await getDatabase();
  try {
    const results = await db.getAllAsync<any>(
      `SELECT * FROM events WHERE session_id = ? ORDER BY occurred_at ASC`,
      [sessionId],
    );
    return results.map(mapRowToEvent);
  } catch (error) {
    console.error("Error fetching events by session:", error);
    throw error;
  }
};

/**
 * Get event summary for a session (count by type)
 */
export const getEventSummaryBySession = async (
  sessionId: string,
): Promise<
  Array<{
    type: EventType;
    count: number;
    totalDeduction: number;
  }>
> => {
  const db = await getDatabase();
  try {
    const results = await db.getAllAsync<any>(
      `SELECT type, COUNT(*) as count, SUM(deduction) as total_deduction
       FROM events 
       WHERE session_id = ? 
       GROUP BY type
       ORDER BY total_deduction DESC`,
      [sessionId],
    );

    return results.map((row: any) => ({
      type: row.type as EventType,
      count: row.count,
      totalDeduction: row.total_deduction,
    }));
  } catch (error) {
    console.error("Error fetching event summary:", error);
    throw error;
  }
};

/**
 * Delete all events for a session
 */
export const deleteEventsBySessionId = async (
  sessionId: string,
): Promise<void> => {
  const db = await getDatabase();
  try {
    await db.runAsync(`DELETE FROM events WHERE session_id = ?`, [sessionId]);
    console.log(`Events for session ${sessionId} deleted`);
  } catch (error) {
    console.error("Error deleting events:", error);
    throw error;
  }
};

/**
 * Delete a single event
 */
export const deleteEventById = async (eventId: string): Promise<void> => {
  const db = await getDatabase();
  try {
    await db.runAsync(`DELETE FROM events WHERE id = ?`, [eventId]);
    console.log(`Event ${eventId} deleted`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Get event count for a session
 */
export const getEventCountBySessionId = async (
  sessionId: string,
): Promise<number> => {
  const db = await getDatabase();
  try {
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM events WHERE session_id = ?`,
      [sessionId],
    );
    return result?.count ?? 0;
  } catch (error) {
    console.error("Error getting event count:", error);
    return 0;
  }
};

/**
 * Get total deduction for a session
 */
export const getTotalDeductionBySessionId = async (
  sessionId: string,
): Promise<number> => {
  const db = await getDatabase();
  try {
    const result = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(deduction), 0) as total FROM events WHERE session_id = ?`,
      [sessionId],
    );
    return result?.total ?? 0;
  } catch (error) {
    console.error("Error getting total deduction:", error);
    return 0;
  }
};

/**
 * Helper: Map database row to DriveEvent type
 */
const mapRowToEvent = (row: any): DriveEvent => ({
  id: row.id,
  sessionId: row.session_id,
  type: row.type as EventType,
  occurredAt: row.occurred_at,
  magnitude: row.magnitude,
  deduction: row.deduction,
  createdAt: row.created_at,
});
