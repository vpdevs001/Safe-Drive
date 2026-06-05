# Driving Safety App — Project Specification

> Offline-first React Native (Expo) application that uses device sensors to analyze driving behavior and generate a safety score.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Scope](#3-project-scope)
4. [Out of Scope](#4-out-of-scope)
5. [Folder Structure](#5-folder-structure)
6. [Screen Architecture & Navigation](#6-screen-architecture--navigation)
7. [Data Layer](#7-data-layer)
8. [Sensor Integration](#8-sensor-integration)
9. [Event Detection Logic & Thresholds](#9-event-detection-logic--thresholds)
10. [Scoring Algorithm](#10-scoring-algorithm)
11. [Styling Conventions](#11-styling-conventions)
12. [Animation Guidelines](#12-animation-guidelines)
13. [Performance & Battery Efficiency](#13-performance--battery-efficiency)
14. [Stretch Goals](#14-stretch-goals)
15. [Screen Inventory](#15-screen-inventory)

---

## 1. Project Overview

A mobile application that collects real-time accelerometer, gyroscope, and device motion data while the user is driving. It detects driving events (harsh braking, sharp turns, phone handling, etc.), deducts points from a starting score of 100, and presents a session summary at the end of every drive.

The app is **fully offline**. No authentication, no backend, no cloud sync. All data is persisted locally on the device using `expo-sqlite`.

---

## 2. Tech Stack

### Core

| Layer | Technology | Reason |
|---|---|---|
| Framework | React Native (Expo SDK 55+) | Cross-platform, managed workflow |
| Language | TypeScript | Type safety across sensors and data models |
| Router | Expo Router (file-based) | Native stack + tab navigation, deep links |
| Storage | expo-sqlite | Structured local data, queryable, no size limits |
| Async KV | @react-native-async-storage/async-storage | User preferences, profile settings |
| Sensors | expo-sensors | Accelerometer, Gyroscope, DeviceMotion, Magnetometer |

### UI & Animation

| Layer | Technology | Reason |
|---|---|---|
| Styling | React Native `StyleSheet` (raw) | No NativeWind, no Tailwind, pure RN |
| Animations | `react-native-reanimated` v3 | Score ring, event flash, screen transitions |
| Gesture handling | `react-native-gesture-handler` | Swipe to dismiss, drag interactions |
| Charts | `react-native-svg` + custom | Score trend bars in history, ring gauge |
| Icons | `@expo/vector-icons` (MaterialCommunityIcons) | Consistent icon set |

### Developer Tooling

| Tool | Purpose |
|---|---|
| TypeScript strict mode | Catch sensor data type mismatches early |
| Expo Go / EAS Build | Local dev + production builds |
| ESLint + Prettier | Code style enforcement |
| dayjs | Lightweight date/time formatting for session timestamps |

---

## 3. Project Scope

### Must Have (Core Requirements)

- [x] **Onboarding flow** — splash, feature tour, permissions, profile setup (4 screens)
- [x] **Start Drive / End Drive** — manual session control with live recording indicator
- [x] **Sensor data collection** — Accelerometer, Gyroscope, DeviceMotion during session
- [x] **Real-time event detection** — harsh braking, harsh acceleration, sharp turns, aggressive steering, excessive device movement, phone handling
- [x] **Live dashboard** — score ring, event counter, event list updating in real time
- [x] **Scoring** — starts at 100, deductions per event type, final score on end
- [x] **Post-drive summary** — score, rating, event breakdown, duration
- [x] **Drive history** — list of all past sessions with score, date, duration
- [x] **Weekly score trend** — bar chart showing avg score per day of the week
- [x] **Profile page** — lifetime stats, settings (sensitivity, alerts, location toggle, export)
- [x] **Offline persistence** — all sessions stored locally via expo-sqlite

### Should Have

- [ ] **Sensor sensitivity setting** — Low / Medium / High, adjusts thresholds at runtime
- [ ] **Event alerts** — in-drive haptic feedback on harsh event detection
- [ ] **Drive naming** — auto-name drives by time of day (Morning commute, Evening drive, etc.)
- [ ] **Export drive data** — share session as JSON or CSV
- [ ] **Safety rating labels** — Excellent / Good / Fair / Needs Work / Poor mapped to score bands

---

## 4. Out of Scope

The following are explicitly **not** being built:

- Authentication (login, signup, OAuth)
- Remote backend or API calls
- Cloud sync or multi-device support
- Real-time map rendering or live GPS tracking
- Push notifications from a server
- In-app purchases or subscription tiers
- Accessibility (a11y) compliance beyond basic contrast

---

## 5. Folder Structure

```
driving-safety-app/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout — wraps everything in gesture handler, reanimated
│   ├── index.tsx                 # Redirect: onboarding or tabs depending on setup state
│   ├── onboarding/
│   │   ├── _layout.tsx           # Stack navigator for onboarding
│   │   ├── welcome.tsx           # Screen 1 — Splash / welcome
│   │   ├── features.tsx          # Screen 2 — Feature tour (swipeable)
│   │   ├── permissions.tsx       # Screen 3 — Sensor + location permissions
│   │   └── profile-setup.tsx     # Screen 4 — Name, experience level, drive type
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab bar definition
│   │   ├── drive/
│   │   │   ├── index.tsx         # Idle state — "Start drive" CTA
│   │   │   └── active.tsx        # Live drive dashboard (score, events)
│   │   ├── history/
│   │   │   ├── index.tsx         # History list + weekly trend chart
│   │   │   └── [id].tsx          # Single session detail / summary
│   │   └── profile/
│   │       └── index.tsx         # Profile stats + settings
│   └── summary.tsx               # Post-drive summary modal (presented over tabs)
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ScoreRing.tsx         # Animated SVG score gauge
│   │   ├── EventCard.tsx         # Single event row (icon, label, count, deduction)
│   │   ├── StatCard.tsx          # Metric tile (value + label)
│   │   ├── TrendChart.tsx        # Weekly bar chart (react-native-svg)
│   │   ├── RatingBadge.tsx       # Excellent / Good / Fair pill
│   │   ├── HistoryItem.tsx       # Drive row in history list
│   │   ├── LivePill.tsx          # "Recording" animated indicator
│   │   └── SectionHeader.tsx     # Uppercase muted section label
│   │
│   ├── sensors/                  # All sensor logic lives here
│   │   ├── useSensorSession.ts   # Master hook — starts/stops all sensors, owns raw data
│   │   ├── useAccelerometer.ts   # Subscribes to Accelerometer, returns smoothed values
│   │   ├── useGyroscope.ts       # Subscribes to Gyroscope, returns rotation rates
│   │   ├── useDeviceMotion.ts    # DeviceMotion composite (gravity + rotation)
│   │   └── useMagnetometer.ts    # Optional magnetometer heading (stretch)
│   │
│   ├── detection/                # Event detection logic
│   │   ├── detectors.ts          # Pure functions: detectBraking, detectAccel, detectTurn, etc.
│   │   ├── thresholds.ts         # All threshold constants, sensitivity multipliers
│   │   └── eventBuffer.ts        # Rolling window / debounce to avoid duplicate events
│   │
│   ├── scoring/
│   │   └── scoreEngine.ts        # Score calculation, deduction map, rating bands
│   │
│   ├── storage/
│   │   ├── database.ts           # SQLite schema, migrations, init
│   │   ├── sessionRepository.ts  # CRUD for drive sessions
│   │   ├── eventRepository.ts    # CRUD for drive events
│   │   └── preferences.ts        # AsyncStorage wrappers for user prefs
│   │
│   ├── hooks/
│   │   ├── useDriveSession.ts    # Orchestrates sensors + detection + scoring during a drive
│   │   ├── useSessionHistory.ts  # Fetches and paginates past sessions from SQLite
│   │   └── useProfile.ts         # Reads/writes user profile and settings
│   │
│   ├── types/
│   │   ├── session.ts            # DriveSession, DriveEvent, SensorReading types
│   │   ├── sensors.ts            # AccelData, GyroData, MotionData types
│   │   └── scoring.ts            # ScoreResult, RatingBand, EventDeduction types
│   │
│   ├── constants/
│   │   ├── colors.ts             # Dark theme color palette
│   │   ├── layout.ts             # Spacing, borderRadius, fontSize scale
│   │   └── ratings.ts            # Score → label → color mapping
│   │
│   └── utils/
│       ├── formatters.ts         # Duration, distance, date formatters using dayjs
│       └── math.ts               # Moving average, magnitude, low-pass filter helpers
│
├── assets/
│   ├── fonts/
│   └── images/
│
├── app.json                      # Expo config — permissions, splash, icons
├── tsconfig.json
├── .eslintrc.js
└── package.json
```

---

## 6. Screen Architecture & Navigation

```
Root
├── /onboarding/*        Stack — shown only once (flag in AsyncStorage)
│   ├── welcome
│   ├── features
│   ├── permissions
│   └── profile-setup    → on complete: set "onboarded=true", navigate to tabs
│
└── /(tabs)              Bottom tabs — persistent after onboarding
    ├── /drive
    │   ├── index        Idle: "Start drive" button
    │   └── active       Live: score ring, event list, "End drive"
    ├── /history
    │   ├── index        Drive list + trend chart
    │   └── [id]         Single session detail
    └── /profile
        └── index        Stats + settings

/summary                 Modal presented over tabs when drive ends
```

### Navigation rules

- Onboarding is a full-screen `<Stack>` with no tab bar visible.
- `app/index.tsx` reads AsyncStorage on mount and redirects to `/onboarding/welcome` or `/(tabs)/drive` accordingly.
- The `active` drive screen locks back navigation — the hardware back button and swipe gestures are intercepted to show a "End drive first?" confirmation dialog.
- `/summary` is presented as a modal (`presentation: 'modal'` in Expo Router) so the tab bar is hidden and the user must explicitly dismiss or go to history.

---

## 7. Data Layer

### SQLite Schema

```sql
-- Drive sessions
CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,     -- uuid v4
  started_at  INTEGER NOT NULL,     -- Unix timestamp ms
  ended_at    INTEGER,
  duration_ms INTEGER,
  score       INTEGER DEFAULT 100,
  rating      TEXT,                 -- 'excellent' | 'good' | 'fair' | 'needs_work' | 'poor'
  event_count INTEGER DEFAULT 0,
  name        TEXT                  -- e.g. "Morning commute"
);

-- Individual events within a session
CREATE TABLE events (
  id          TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL REFERENCES sessions(id),
  type        TEXT NOT NULL,        -- 'harsh_brake' | 'harsh_accel' | 'sharp_turn' | ...
  occurred_at INTEGER NOT NULL,     -- Unix timestamp ms
  magnitude   REAL,                 -- raw sensor value that triggered detection
  deduction   INTEGER               -- points deducted for this event
);
```

### AsyncStorage keys

| Key | Type | Purpose |
|---|---|---|
| `@app/onboarded` | boolean | Has the user completed onboarding? |
| `@app/profile` | JSON | Name, experience level, drive type |
| `@app/settings` | JSON | Sensitivity, alerts enabled, location enabled |

---

## 8. Sensor Integration

All sensors are managed through `expo-sensors`. Each sensor hook subscribes on mount and unsubscribes on cleanup.

### Sensor update intervals

| Sensor | Interval | Reason |
|---|---|---|
| Accelerometer | 100ms | Fast enough for braking/acceleration without battery drain |
| Gyroscope | 100ms | Matched to accelerometer for event correlation |
| DeviceMotion | 200ms | Composite data, heavier — less frequent is fine |
| Magnetometer | 500ms | Heading only — slow changes, 500ms is sufficient |

### Low-pass filter

Raw accelerometer data is noisy. Apply a low-pass filter before running detection:

```ts
// src/utils/math.ts
export const lowPass = (current: number, previous: number, alpha = 0.8): number =>
  alpha * previous + (1 - alpha) * current;
```

`alpha = 0.8` preserves 80% of the previous value — smooths noise while keeping real events responsive.

### Vector magnitude

```ts
export const magnitude = (x: number, y: number, z: number): number =>
  Math.sqrt(x * x + y * y + z * z);
```

Used to compute total acceleration force regardless of phone orientation.

---

## 9. Event Detection Logic & Thresholds

All thresholds are defined in `src/detection/thresholds.ts` and multiplied by a sensitivity factor at runtime.

### Sensitivity multipliers

```ts
export const SENSITIVITY = {
  low:    1.3,   // harder to trigger — forgives more
  medium: 1.0,   // default
  high:   0.7,   // easier to trigger — stricter
};
```

### Event thresholds (medium sensitivity)

| Event | Sensor | Condition | Threshold | Deduction |
|---|---|---|---|---|
| Harsh braking | Accelerometer (X axis) | Negative X acceleration (forward decel) | < -1.5 G | -5 pts |
| Harsh acceleration | Accelerometer (X axis) | Positive X acceleration | > 1.5 G | -5 pts |
| Sharp turn | Gyroscope (Z axis) | Angular velocity around vertical axis | > 1.2 rad/s | -3 pts |
| Aggressive steering | Gyroscope (Z axis) | Sustained high rotation rate > 300ms | > 0.9 rad/s sustained | -3 pts |
| Excessive device movement | Accelerometer (magnitude) | Total movement vector spike | > 2.5 G | -2 pts |
| Phone handling | DeviceMotion (all axes) | Complex multi-axis motion inconsistent with road movement | Pattern match | -10 pts |

> **Note on phone handling detection:** True phone pickup is detected by a combination of: (a) sudden reorientation of the gravity vector (phone tilted from mount to hand), plus (b) fine motor movement on the accelerometer (tapping/swiping). A single condition alone is insufficient — both must trigger within a 500ms window.

### Debouncing

To prevent a single real event from generating dozens of detections, each event type has a cooldown:

```ts
export const COOLDOWN_MS = {
  harsh_brake:    2000,
  harsh_accel:    2000,
  sharp_turn:     1500,
  aggressive_steer: 1500,
  excessive_movement: 1000,
  phone_handling: 5000,   // longer — phone handling is a big deal
};
```

---

## 10. Scoring Algorithm

```ts
// src/scoring/scoreEngine.ts

export const DEDUCTIONS: Record<EventType, number> = {
  harsh_brake:          5,
  harsh_accel:          5,
  sharp_turn:           3,
  aggressive_steer:     3,
  excessive_movement:   2,
  phone_handling:      10,
};

export const RATING_BANDS = [
  { min: 90, label: 'Excellent',   color: '#5ac87a' },
  { min: 80, label: 'Good',        color: '#5ac87a' },
  { min: 70, label: 'Fair',        color: '#e8a63d' },
  { min: 60, label: 'Needs work',  color: '#f0716e' },
  { min: 0,  label: 'Poor',        color: '#f0716e' },
];

export const calculateScore = (events: DriveEvent[]): number => {
  const total = events.reduce((acc, e) => acc - DEDUCTIONS[e.type], 100);
  return Math.max(0, total); // floor at 0
};

export const getRating = (score: number): RatingBand =>
  RATING_BANDS.find(b => score >= b.min) ?? RATING_BANDS[RATING_BANDS.length - 1];
```

Score is recalculated live as events come in during the drive — the ring and number animate with every new deduction.

---

## 11. Styling Conventions

No NativeWind, no Tailwind. Pure `StyleSheet.create()` throughout.

### Theme file — `src/constants/colors.ts`

```ts
export const Colors = {
  bg: {
    primary:   '#0d0f14',
    surface:   '#1c1f29',
    elevated:  '#252836',
    border:    '#2a2d36',
  },
  text: {
    primary:   '#e8eaf0',
    secondary: '#c8cad4',
    muted:     '#7a7f8e',
  },
  accent: {
    blue:      '#4d9ee8',
    green:     '#5ac87a',
    amber:     '#e8a63d',
    red:       '#f0716e',
    pink:      '#d46a9a',
  },
};
```

### Layout scale — `src/constants/layout.ts`

```ts
export const Layout = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius:  { sm: 8, md: 10, lg: 14, xl: 20, full: 999 },
  font:    { xs: 10, sm: 11, md: 13, base: 15, lg: 17, xl: 22 },
};
```

### Rules

- All colors come from `Colors.*` — no hardcoded hex values in component files.
- All spacing/radius come from `Layout.*`.
- `StyleSheet.create()` must be defined at the bottom of every component file, outside the component function.
- No inline styles except for dynamic values (e.g. `{ width: score + '%' }`).

---

## 12. Animation Guidelines

Use `react-native-reanimated` v3 for all animations.

| Animation | Approach | Location |
|---|---|---|
| Score ring fill | `useSharedValue` + `useDerivedValue` on `strokeDashoffset` | `ScoreRing.tsx` |
| Score number count-up | `useSharedValue` animated to new value, `useAnimatedProps` | `ScoreRing.tsx` |
| Event card flash on new event | `withSequence(withTiming, withTiming)` on background opacity | `EventCard.tsx` |
| Tab bar transitions | Expo Router default (native stack) | `_layout.tsx` |
| Drive → Summary modal | `presentation: 'modal'` in Expo Router — native sheet | `summary.tsx` |
| Live recording pulse dot | `withRepeat(withSequence(...))` on opacity | `LivePill.tsx` |
| Screen entry | `FadeInDown` from `react-native-reanimated` entering prop | Per screen |

### Score ring formula

```ts
const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54 matches SVG viewBox

const strokeOffset = useDerivedValue(() =>
  CIRCUMFERENCE - (score.value / 100) * CIRCUMFERENCE
);
```

---

## 13. Performance & Battery Efficiency

Sensor polling is the biggest battery concern. Follow these rules:

- **Unsubscribe immediately** when a drive session ends — never leave sensors running in the background.
- **100ms polling interval** is the minimum needed for accurate event detection. Do not go lower.
- Use `InteractionManager.runAfterInteractions()` when writing to SQLite — never block the JS thread during active sensor reads.
- Batch event writes: accumulate events in memory during the drive, flush to SQLite only on session end (or every 30 seconds as a safety checkpoint).
- The `active.tsx` screen should use `useFocusEffect` to start/stop sensors — sensors must not run if the screen is not focused.
- Avoid re-rendering the full event list on every sensor tick. The score and live counters update every 500ms via a `setInterval`; the event list only re-renders when a new event is added.
- Use `React.memo` on `EventCard`, `StatCard`, and `HistoryItem` — they receive stable props.

---

## 14. Stretch Goals

These are not required but are designed to slot cleanly into the existing architecture:

| Feature | Implementation hint |
|---|---|
| AI-generated drive feedback | Call Anthropic API at session end with event summary, render result in summary screen |
| Event timeline | New tab on the summary screen — vertical list of events with timestamps and magnitudes |
| Event heatmap | Only relevant if location is enabled — plot events on a map using `react-native-maps` |
| Route replay | Requires GPS logging during session — store `[lat, lng, timestamp]` array, animate a marker along the path |
| Historical drive comparison | Aggregate query across sessions table — weekly/monthly avg score, best/worst drive |
| Magnetometer heading | Detect U-turns or erratic direction changes using compass heading delta |

---

## 15. Screen Inventory

| Screen | Route | Tab | Description |
|---|---|---|---|
| Welcome | `/onboarding/welcome` | — | Splash, app value prop, get started CTA |
| Feature tour | `/onboarding/features` | — | Swipeable cards showing what the app detects |
| Permissions | `/onboarding/permissions` | — | Motion sensors, location, notifications |
| Profile setup | `/onboarding/profile-setup` | — | Name, experience level, drive type |
| Drive idle | `/(tabs)/drive` | Drive | Start drive CTA, last session summary |
| Drive active | `/(tabs)/drive/active` | Drive | Live score ring, event list, end drive |
| Post-drive summary | `/summary` | Modal | Final score, rating, event breakdown, AI feedback |
| History | `/(tabs)/history` | History | Weekly trend chart + drive list |
| Session detail | `/(tabs)/history/[id]` | History | Full breakdown of a single past drive |
| Profile | `/(tabs)/profile` | Profile | Lifetime stats + settings |

---
