/**
 * Hook for gyroscope subscription and smoothed readings.
 */

import { Gyroscope } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { GyroData } from "../types/sensors";
import { lowPass } from "../utils/math";

const DEFAULT_INTERVAL = 100;

export const useGyroscope = (intervalMs = DEFAULT_INTERVAL) => {
  const [data, setData] = useState<GyroData | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const previous = useRef<GyroData | null>(null);
  const subscription = useRef<any>(null);

  useEffect(() => {
    Gyroscope.setUpdateInterval(intervalMs);
    return () => stop();
  }, [intervalMs]);

  const normalize = (raw: GyroData): GyroData => {
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
      subscription.current = Gyroscope.addListener((rawData) => {
        const reading: GyroData = {
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
      console.error("Gyroscope subscription failed:", error);
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
    setUpdateInterval: Gyroscope.setUpdateInterval,
  };
};
