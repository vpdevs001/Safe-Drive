/**
 * Hook for accelerometer subscription and smoothed readings.
 */

import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { AccelData } from "../types/sensors";
import { lowPass } from "../utils/math";

const DEFAULT_INTERVAL = 100;

export const useAccelerometer = (intervalMs = DEFAULT_INTERVAL) => {
  const [data, setData] = useState<AccelData | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const previous = useRef<AccelData | null>(null);
  const subscription = useRef<any>(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(intervalMs);
    return () => stop();
  }, [intervalMs]);

  const normalize = (raw: AccelData): AccelData => {
    if (!previous.current) {
      previous.current = raw;
      return raw;
    }

    const smoothX = lowPass(raw.x, previous.current.x);
    const smoothY = lowPass(raw.y, previous.current.y);
    const smoothZ = lowPass(raw.z, previous.current.z);

    const next = {
      x: smoothX,
      y: smoothY,
      z: smoothZ,
      timestamp: raw.timestamp,
    };

    previous.current = next;
    return next;
  };

  const start = async () => {
    try {
      subscription.current = Accelerometer.addListener((rawData) => {
        const reading: AccelData = {
          x: rawData.x,
          y: rawData.y,
          z: rawData.z,
          timestamp: rawData.timestamp ?? Date.now(),
        };
        setData(normalize(reading));
      });
      setIsAvailable(true);
      setIsActive(true);
    } catch (error) {
      console.error("Accelerometer subscription failed:", error);
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
    setUpdateInterval: Accelerometer.setUpdateInterval,
  };
};
