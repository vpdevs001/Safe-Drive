import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Vibration } from "react-native";
import { createEvent } from "../db/eventRepository";
import {
  getSettings,
  setAlertsEnabled as persistAlertsEnabled,
  setSensitivity as persistSensitivity,
} from "../db/preferences";
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
  setSensitivity: (value: SensitivityLevel) => Promise<void>;
  alertsEnabled: boolean;
  setAlertsEnabled: (enabled: boolean) => Promise<void>;
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
  const [alertsEnabled, setAlertsEnabledState] = useState(true);

  const persistEvent = useCallback(
    async (event: RuntimeDriveEvent) => {
      if (!activeSessionId.current) {
        return;
      }

      if (alertsEnabled) {
        Vibration.vibrate(30);
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
    },
    [alertsEnabled],
  );

  const sensorSession = useSensorSession({
    onEventDetected: persistEvent,
  });

  useEffect(() => {
    let isMounted = true;
    getSettings()
      .then((settings) => {
        if (!isMounted) return;
        setAlertsEnabledState(settings.alertsEnabled);
        sensorSession.setSensitivity(settings.sensitivity);
      })
      .catch((err) => {
        console.error("Unable to load settings:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [sensorSession]);

  const setSensitivityValue = useCallback(
    async (value: SensitivityLevel) => {
      sensorSession.setSensitivity(value);
      try {
        await persistSensitivity(value);
      } catch (err) {
        console.error("Unable to persist sensitivity:", err);
      }
    },
    [sensorSession],
  );

  const setAlertsEnabled = useCallback(async (enabled: boolean) => {
    setAlertsEnabledState(enabled);
    try {
      await persistAlertsEnabled(enabled);
    } catch (err) {
      console.error("Unable to persist alert preference:", err);
    }
  }, []);

  const getDriveSessionName = (): string => {
    const hour = new Date().getHours();
    if (hour < 7) return "Morning commute";
    if (hour < 10) return "Morning drive";
    if (hour < 16) return "Afternoon drive";
    if (hour < 19) return "Evening commute";
    return "Night drive";
  };

  const start = useCallback(async (): Promise<boolean> => {
    setError(null);

    try {
      const session = await createSession({
        startedAt: Date.now(),
        score: 100,
        eventCount: 0,
        name: getDriveSessionName(),
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
    alertsEnabled,
    setAlertsEnabled,
    setSensitivity: setSensitivityValue,
    rating,
    error,
  };
};
