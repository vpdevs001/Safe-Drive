/**
 * Event detection functions for driving safety analysis
 */

import { MotionData } from '../types/sensors';
import { EventType } from '../types/session';
import {
  EVENT_THRESHOLDS,
  SensitivityLevel,
  SENSITIVITY_MULTIPLIER,
} from './thresholds';
import { magnitude, normalizeOrientationDelta } from '../utils/math';

const multiply = (value: number, sensitivity: SensitivityLevel): number =>
  value * SENSITIVITY_MULTIPLIER[sensitivity];

export const detectHarshBraking = (
  accelX: number,
  sensitivity: SensitivityLevel
): boolean => {
  const threshold = multiply(EVENT_THRESHOLDS.harsh_brake.accelX ?? -1.5, sensitivity);
  return accelX <= threshold;
};

export const detectHarshAcceleration = (
  accelX: number,
  sensitivity: SensitivityLevel
): boolean => {
  const threshold = multiply(EVENT_THRESHOLDS.harsh_accel.accelX ?? 1.5, sensitivity);
  return accelX >= threshold;
};

export const detectSharpTurn = (
  gyroZ: number,
  sensitivity: SensitivityLevel
): boolean => {
  const threshold = multiply(EVENT_THRESHOLDS.sharp_turn.gyroZ ?? 1.2, sensitivity);
  return Math.abs(gyroZ) >= threshold;
};

export const detectAggressiveSteering = (
  gyroZ: number,
  recentZ: number[],
  sensitivity: SensitivityLevel
): boolean => {
  const threshold = multiply(EVENT_THRESHOLDS.aggressive_steer.gyroZ ?? 0.9, sensitivity);
  const sustainedSamples = EVENT_THRESHOLDS.aggressive_steer.sustainedSamples ?? 3;
  const strongSamples = recentZ.filter((value) => Math.abs(value) >= threshold).length;
  return Math.abs(gyroZ) >= threshold && strongSamples >= sustainedSamples;
};

export const detectExcessiveMovement = (
  accelX: number,
  accelY: number,
  accelZ: number,
  sensitivity: SensitivityLevel
): boolean => {
  const threshold = multiply(EVENT_THRESHOLDS.excessive_movement.magnitude ?? 2.5, sensitivity);
  return magnitude(accelX, accelY, accelZ) >= threshold;
};

export const detectPhoneHandling = (
  motion: MotionData,
  previousMotion: MotionData | null,
  sensitivity: SensitivityLevel
): boolean => {
  if (!previousMotion) {
    return false;
  }

  const rotationThreshold = multiply(EVENT_THRESHOLDS.phone_handling.rotationRate ?? 0.9, sensitivity);
  const accelThreshold = multiply(EVENT_THRESHOLDS.phone_handling.magnitude ?? 1.3, sensitivity);
  const orientationThreshold = EVENT_THRESHOLDS.phone_handling.orientationDelta ?? 0.35;

  const rotationMag = magnitude(
    motion.rotationRate.x,
    motion.rotationRate.y,
    motion.rotationRate.z
  );

  const accelMag = magnitude(
    motion.acceleration.x,
    motion.acceleration.y,
    motion.acceleration.z
  );

  const orientationDelta = normalizeOrientationDelta(
    motion.orientation,
    previousMotion.orientation
  );

  const hasSignificantRotation = rotationMag >= rotationThreshold;
  const hasPhoneMovement = accelMag >= accelThreshold;
  const hasOrientationChange = orientationDelta >= orientationThreshold;

  return hasSignificantRotation && hasPhoneMovement && hasOrientationChange;
};

export const getEventDeduction = (type: EventType): number =>
  EVENT_THRESHOLDS[type].deduction;

export const getEventCooldown = (type: EventType): number =>
  EVENT_THRESHOLDS[type].cooldownMs;

export const getEventTypeLabel = (type: EventType): string => {
  switch (type) {
    case 'harsh_brake':
      return 'Harsh brake';
    case 'harsh_accel':
      return 'Hard acceleration';
    case 'sharp_turn':
      return 'Sharp turn';
    case 'aggressive_steer':
      return 'Aggressive steering';
    case 'excessive_movement':
      return 'Excessive movement';
    case 'phone_handling':
      return 'Phone handling';
    default:
      return 'Unknown event';
  }
};
