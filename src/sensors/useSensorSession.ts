/**
 * Master sensor session hook.
 * Orchestrates accelerometer, gyroscope, device motion, and event detection.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  detectAggressiveSteering,
  detectExcessiveMovement,
  detectHarshAcceleration,
  detectHarshBraking,
  detectPhoneHandling,
  detectSharpTurn,
  getEventCooldown,
  getEventDeduction,
  getEventTypeLabel,
} from "../detection/detectors";
import { EventCooldownManager } from "../detection/eventBuffer";
import { SensitivityLevel } from "../detection/thresholds";
import { MotionData } from "../types/sensors";
import { EventType } from "../types/session";
import { magnitude } from "../utils/math";
import { useAccelerometer } from "./useAccelerometer";
import { useDeviceMotion } from "./useDeviceMotion";
import { useGyroscope } from "./useGyroscope";

export interface RuntimeDriveEvent {
  id: string;
  type: EventType;
  occurrenceTime: number;
  deduction: number;
  magnitude: number;
  label: string;
}

export interface SensorSessionOptions {
  sensitivity?: SensitivityLevel;
  onEventDetected?: (event: RuntimeDriveEvent) => void;
}

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useSensorSession = ({
  sensitivity = "medium",
  onEventDetected,
}: SensorSessionOptions = {}) => {
  const accelerometer = useAccelerometer();
  const gyroscope = useGyroscope();
  const deviceMotion = useDeviceMotion();
  const eventBuffer = useRef(new EventCooldownManager());
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<RuntimeDriveEvent[]>([]);
  const [score, setScore] = useState(100);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [sessionDurationMs, setSessionDurationMs] = useState(0);
  const previousMotion = useRef<MotionData | null>(null);
  const recentGyroZ = useRef<number[]>([]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [currentSensitivity, setCurrentSensitivity] =
    useState<SensitivityLevel>(sensitivity);

  const resetSession = useCallback(() => {
    eventBuffer.current.reset();
    setEvents([]);
    setScore(100);
    setSessionStart(null);
    setSessionDurationMs(0);
    recentGyroZ.current = [];
    previousMotion.current = null;
  }, []);

  const emitEvent = useCallback(
    (type: EventType, magnitudeValue: number) => {
      const cooldownMs = getEventCooldown(type);
      if (!eventBuffer.current.canEmit(type, cooldownMs)) {
        return;
      }

      const deduction = getEventDeduction(type);
      const event: RuntimeDriveEvent = {
        id: generateId(),
        type,
        occurrenceTime: sessionStart ? Date.now() - sessionStart : 0,
        deduction,
        magnitude: magnitudeValue,
        label: getEventTypeLabel(type),
      };

      setEvents((prev) => [event, ...prev]);
      setScore((prev) => Math.max(0, prev - deduction));
      onEventDetected?.(event);
    },
    [onEventDetected, sessionStart],
  );

  useEffect(() => {
    if (!isRunning || sessionStart === null) {
      return;
    }

    intervalId.current = setInterval(() => {
      setSessionDurationMs(Date.now() - sessionStart);
    }, 500);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isRunning, sessionStart]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const accel = accelerometer.data;
    if (!accel) {
      return;
    }

    if (detectHarshBraking(accel.x, currentSensitivity)) {
      emitEvent("harsh_brake", Math.abs(accel.x));
    }

    if (detectHarshAcceleration(accel.x, currentSensitivity)) {
      emitEvent("harsh_accel", Math.abs(accel.x));
    }

    if (
      detectExcessiveMovement(accel.x, accel.y, accel.z, currentSensitivity)
    ) {
      emitEvent("excessive_movement", magnitude(accel.x, accel.y, accel.z));
    }
  }, [accelerometer.data, currentSensitivity, emitEvent, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const gyro = gyroscope.data;
    if (!gyro) {
      return;
    }

    recentGyroZ.current = [gyro.z, ...recentGyroZ.current].slice(0, 6);

    if (detectSharpTurn(gyro.z, currentSensitivity)) {
      emitEvent("sharp_turn", Math.abs(gyro.z));
    }

    if (
      detectAggressiveSteering(gyro.z, recentGyroZ.current, currentSensitivity)
    ) {
      emitEvent("aggressive_steer", Math.abs(gyro.z));
    }
  }, [currentSensitivity, emitEvent, gyroscope.data, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const motion = deviceMotion.data;
    if (!motion) {
      return;
    }

    const previous = previousMotion.current;
    if (detectPhoneHandling(motion, previous, currentSensitivity)) {
      emitEvent(
        "phone_handling",
        magnitude(
          motion.rotationRate.x,
          motion.rotationRate.y,
          motion.rotationRate.z,
        ),
      );
    }

    previousMotion.current = motion;
  }, [currentSensitivity, deviceMotion.data, emitEvent, isRunning]);

  const start = useCallback(() => {
    resetSession();
    setSessionStart(Date.now());
    setIsRunning(true);
    accelerometer.start();
    gyroscope.start();
    deviceMotion.start();
  }, [accelerometer, deviceMotion, gyroscope, resetSession]);

  const stop = useCallback(() => {
    accelerometer.stop();
    gyroscope.stop();
    deviceMotion.stop();
    setIsRunning(false);
  }, [accelerometer, deviceMotion, gyroscope]);

  const isReady = useMemo(
    () =>
      accelerometer.isAvailable &&
      gyroscope.isAvailable &&
      deviceMotion.isAvailable,
    [
      accelerometer.isAvailable,
      deviceMotion.isAvailable,
      gyroscope.isAvailable,
    ],
  );

  return {
    isRunning,
    isReady,
    events,
    score,
    sessionDurationMs,
    start,
    stop,
    sensitivity: currentSensitivity,
    setSensitivity: setCurrentSensitivity,
  };
};
