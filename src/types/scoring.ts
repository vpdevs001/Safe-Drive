/**
 * Scoring and rating type definitions
 */

import { EventType, RatingType } from './session';

/**
 * Deduction mapping for each event type
 */
export interface EventDeduction {
  type: EventType;
  points: number;
  cooldownMs: number;
}

/**
 * Rating band definition
 */
export interface RatingBand {
  min: number;
  max?: number;
  label: RatingType;
  title: string; // Human-readable: "Excellent Driver"
  color: string; // Hex color
  description: string; // Short feedback message
}

/**
 * Score calculation result
 */
export interface ScoreResult {
  currentScore: number;
  eventCount: number;
  totalDeductions: number;
  rating: RatingBand;
  events: Array<{
    type: EventType;
    count: number;
    totalDeduction: number;
  }>;
}

/**
 * Drive session summary (used for display)
 */
export interface DriveSummary {
  sessionId: string;
  finalScore: number;
  rating: RatingBand;
  durationMs: number;
  eventCount: number;
  eventBreakdown: Array<{
    type: EventType;
    count: number;
    totalDeduction: number;
  }>;
  startedAt: number;
  endedAt: number;
}
