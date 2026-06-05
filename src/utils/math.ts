/**
 * Math utilities for sensor event detection
 */

export const lowPass = (current: number, previous: number, alpha = 0.8): number =>
  alpha * previous + (1 - alpha) * current;

export const magnitude = (x: number, y: number, z: number): number =>
  Math.sqrt(x * x + y * y + z * z);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const delta = (current: number, previous: number): number => current - previous;

export const normalizeOrientationDelta = (current: number, previous: number): number => {
  const raw = Math.abs(current - previous);
  return Math.min(raw, 2 * Math.PI - raw);
};
