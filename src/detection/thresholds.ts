/**
 * Event thresholds, sensitivity multipliers, and cooldown timing
 */

import { EventType } from '../types/session';

export type SensitivityLevel = 'low' | 'medium' | 'high';

export const SENSITIVITY_MULTIPLIER: Record<SensitivityLevel, number> = {
  low: 1.3,
  medium: 1.0,
  high: 0.7,
};

export const SENSOR_INTERVAL_MS = {
  accelerometer: 100,
  gyroscope: 100,
  deviceMotion: 200,
  magnetometer: 500,
};

export interface EventThresholdConfig {
  accelX?: number;
  gyroZ?: number;
  magnitude?: number;
  rotationRate?: number;
  orientationDelta?: number;
  sustainedSamples?: number;
  deduction: number;
  cooldownMs: number;
}

export const EVENT_THRESHOLDS: Record<EventType, EventThresholdConfig> = {
  harsh_brake: {
    accelX: -1.5,
    deduction: 5,
    cooldownMs: 2000,
  },
  harsh_accel: {
    accelX: 1.5,
    deduction: 5,
    cooldownMs: 2000,
  },
  sharp_turn: {
    gyroZ: 1.2,
    deduction: 3,
    cooldownMs: 1500,
  },
  aggressive_steer: {
    gyroZ: 0.9,
    sustainedSamples: 3,
    deduction: 3,
    cooldownMs: 1500,
  },
  excessive_movement: {
    magnitude: 2.5,
    deduction: 2,
    cooldownMs: 1000,
  },
  phone_handling: {
    rotationRate: 0.9,
    magnitude: 1.3,
    orientationDelta: 0.35,
    deduction: 10,
    cooldownMs: 5000,
  },
};

export const DEFAULT_SENSITIVITY: SensitivityLevel = 'medium';
