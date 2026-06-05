import { useCallback, useEffect, useState } from "react";
import { getAllSessions } from "../db/sessionRepository";
import { DriveSession } from "../types/session";

export const useSessionHistory = () => {
  const [sessions, setSessions] = useState<DriveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedSessions = await getAllSessions();
      setSessions(loadedSessions);
    } catch (err) {
      console.error("Failed to load session history:", err);
      setError("Could not fetch drive history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    sessions,
    loading,
    error,
    refresh: loadHistory,
  };
};
