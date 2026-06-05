/**
 * Optional magnetometer hook. Provides heading data for later stretch goals.
 */

import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { MagnetometerData } from "../types/sensors";

const DEFAULT_INTERVAL = 500;

export const useMagnetometer = (intervalMs = DEFAULT_INTERVAL) => {
  const [data, setData] = useState<MagnetometerData | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const subscription = useRef<any>(null);

  useEffect(() => {
    Magnetometer.setUpdateInterval(intervalMs);
    return () => stop();
  }, [intervalMs]);

  const start = async () => {
    try {
      subscription.current = Magnetometer.addListener((rawData) => {
        const payload = rawData as any;
        const heading = Math.atan2(payload.y, payload.x) * (180 / Math.PI);
        const normalizedHeading = heading >= 0 ? heading : heading + 360;

        const reading: MagnetometerData = {
          heading: normalizedHeading,
          accuracy: payload.accuracy ?? 0,
          timestamp: Date.now(),
        };

        setData(reading);
      });
      setIsAvailable(true);
      setIsActive(true);
    } catch (error) {
      console.error("Magnetometer subscription failed:", error);
      setIsAvailable(false);
      setIsActive(false);
    }
  };

  const stop = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    setIsActive(false);
  };

  return {
    data,
    isAvailable,
    isActive,
    start,
    stop,
    setUpdateInterval: Magnetometer.setUpdateInterval,
  };
};
