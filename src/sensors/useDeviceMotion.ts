/**
 * Hook for DeviceMotion readings used to detect phone handling and complex movement.
 */

import { DeviceMotion } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { MotionData } from "../types/sensors";

const DEFAULT_INTERVAL = 200;

export const useDeviceMotion = (intervalMs = DEFAULT_INTERVAL) => {
  const [data, setData] = useState<MotionData | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  const subscription = useRef<any>(null);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(intervalMs);
    return () => stop();
  }, [intervalMs]);

  const start = async () => {
    try {
      subscription.current = DeviceMotion.addListener((rawData) => {
        const payload = rawData as any;
        const reading: MotionData = {
          acceleration: {
            x: payload.acceleration?.x ?? 0,
            y: payload.acceleration?.y ?? 0,
            z: payload.acceleration?.z ?? 0,
          },
          accelerationIncludingGravity: {
            x: payload.accelerationIncludingGravity?.x ?? 0,
            y: payload.accelerationIncludingGravity?.y ?? 0,
            z: payload.accelerationIncludingGravity?.z ?? 0,
          },
          rotationRate: {
            x: payload.rotationRate?.alpha ?? 0,
            y: payload.rotationRate?.beta ?? 0,
            z: payload.rotationRate?.gamma ?? 0,
          },
          orientation: payload.orientation ?? 0,
          timestamp: Date.now(),
        };

        setData(reading);
      });
      setIsAvailable(true);
      setIsActive(true);
    } catch (error) {
      console.error("DeviceMotion subscription failed:", error);
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
    setUpdateInterval: DeviceMotion.setUpdateInterval,
  };
};
