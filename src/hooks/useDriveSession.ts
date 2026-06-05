import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { createEvent } from "../db/eventRepository";
import { createSession, updateSession } from "../db/sessionRepository";
import { SensitivityLevel } from "../detection/thresholds";
import {
  RuntimeDriveEvent,
  useSensorSession,
} from "../sensors/useSensorSession";
import { RatingType } from "../types/session";

export interface DriveSessionHook {
  isRunning: boolean;
  isReady: boolean;
  events: RuntimeDriveEvent[];
  score: number;
  sessionDurationMs: number;
  start: () => Promise<boolean>;
  stop: () => Promise<void>;
  sensitivity: SensitivityLevel;
  setSensitivity: Dispatch<SetStateAction<SensitivityLevel>>;
  rating: RatingType;
  error: string | null;
}

const getRating = (score: number): RatingType => {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "fair";
  if (score >= 60) return "needs_work";
  return "poor";
};

export const useDriveSession = (): DriveSessionHook => {
  const activeSessionId = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const persistEvent = useCallback(async (event: RuntimeDriveEvent) => {
    if (!activeSessionId.current) {
      return;
    }

    try {
      await createEvent({
        sessionId: activeSessionId.current,
        type: event.type,
        occurredAt: Date.now(),
        magnitude: event.magnitude,
        deduction: event.deduction,
      });
    } catch (err) {
      console.error("Failed to persist drive event:", err);
      setError("Unable to save event");
    }
  }, []);

  const sensorSession = useSensorSession({
    onEventDetected: persistEvent,
  });

  const start = useCallback(async (): Promise<boolean> => {
    setError(null);

    try {
      const session = await createSession({
        startedAt: Date.now(),
        score: 100,
        eventCount: 0,
      });

      activeSessionId.current = session.id;
      sensorSession.start();
      return true;
    } catch (err) {
      console.error("Failed to start drive session:", err);
      setError("Unable to start drive session");
      return false;
    }
  }, [sensorSession]);

  const stop = useCallback(async () => {
    sensorSession.stop();

    if (!activeSessionId.current) {
      return;
    }

    const endedAt = Date.now();
    const durationMs = sensorSession.sessionDurationMs;
    const score = sensorSession.score;
    const eventCount = sensorSession.events.length;
    const rating = getRating(score);

    try {
      await updateSession(activeSessionId.current, {
        endedAt,
        durationMs,
        score,
        rating,
        eventCount,
      });
    } catch (err) {
      console.error("Failed to finalize drive session:", err);
      setError("Unable to save session summary");
    } finally {
      activeSessionId.current = null;
    }
  }, [sensorSession]);

  const rating = useMemo(
    () => getRating(sensorSession.score),
    [sensorSession.score],
  );

  return {
    ...sensorSession,
    start,
    stop,
    rating,
    error,
  };
};
