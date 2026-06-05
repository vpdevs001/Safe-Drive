/**
 * Session and Event type definitions
 */

export type EventType = 
  | 'harsh_brake'
  | 'harsh_accel'
  | 'sharp_turn'
  | 'aggressive_steer'
  | 'excessive_movement'
  | 'phone_handling';

export type RatingType = 'excellent' | 'good' | 'fair' | 'needs_work' | 'poor';

/**
 * Represents a single driving session
 */
export interface DriveSession {
  id: string; // UUID v4
  startedAt: number; // Unix timestamp in ms
  endedAt?: number; // Unix timestamp in ms
  durationMs?: number; // Duration in milliseconds
  score: number; // Final score (100 - deductions)
  rating?: RatingType; // Derived from score
  eventCount: number; // Total events in session
  name?: string; // e.g. "Morning commute"
  createdAt: number; // Insertion timestamp
}

/**
 * Represents a single driving event within a session
 */
export interface DriveEvent {
  id: string; // UUID v4
  sessionId: string; // Foreign key to sessions
  type: EventType;
  occurredAt: number; // Unix timestamp in ms (relative to session start)
  magnitude: number; // Raw sensor value that triggered detection
  deduction: number; // Points deducted for this event
  createdAt: number; // Insertion timestamp
}

/**
 * Sensor reading snapshot (not persisted, used for real-time processing)
 */
export interface SensorReading {
  timestamp: number;
  accelerometer?: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope?: {
    x: number;
    y: number;
    z: number;
  };
  deviceMotion?: {
    acceleration: { x: number; y: number; z: number };
    accelerationIncludingGravity: { x: number; y: number; z: number };
    rotationRate: { x: number; y: number; z: number };
    orientation: number;
  };
}

/**
 * User profile data
 */
export interface UserProfile {
  name: string;
  experienceLevel: 'new_driver' | 'experienced' | 'professional';
  typicalDrive: 'city' | 'highway' | 'mixed';
  createdAt: number;
  updatedAt: number;
}

/**
 * User settings/preferences
 */
export interface UserSettings {
  sensitivity: 'low' | 'medium' | 'high';
  alertsEnabled: boolean;
  locationEnabled: boolean;
  updatedAt: number;
}
