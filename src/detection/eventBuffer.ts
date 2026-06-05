/**
 * Debounce manager for sensor event emission.
 * Prevents repeated detections of the same event type within a cooldown window.
 */

import { EventType } from '../types/session';

export class EventCooldownManager {
  private lastEventAt: Partial<Record<EventType, number>> = {};

  canEmit(type: EventType, cooldownMs: number): boolean {
    const now = Date.now();
    const last = this.lastEventAt[type] ?? 0;
    if (now - last < cooldownMs) {
      return false;
    }
    this.lastEventAt[type] = now;
    return true;
  }

  reset(): void {
    this.lastEventAt = {};
  }
}
