import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { CircularProgress } from "../../components/CircularProgress";
import { EventCard } from "../../components/EventCard";
import { SectionHeader } from "../../components/SectionHeader";
import { StatCard } from "../../components/StatCard";
import { theme } from "../../constants/theme";
import { SensitivityLevel } from "../../detection/thresholds";
import { useDriveSession } from "../../hooks/useDriveSession";
import { RuntimeDriveEvent } from "../../sensors/useSensorSession";
import { EventType, RatingType } from "../../types/session";

type DriveState = "pre" | "active" | "summary";

const eventCardMap: Record<
  EventType,
  { cardType: "brake" | "acceleration" | "turn" | "phone"; title: string }
> = {
  harsh_brake: { cardType: "brake", title: "Harsh brake" },
  harsh_accel: { cardType: "acceleration", title: "Hard accel." },
  sharp_turn: { cardType: "turn", title: "Sharp turn" },
  aggressive_steer: { cardType: "turn", title: "Aggressive steering" },
  excessive_movement: { cardType: "acceleration", title: "Excessive movement" },
  phone_handling: { cardType: "phone", title: "Phone handling" },
};

const ratingTitles: Record<RatingType, string> = {
  excellent: "Excellent driver",
  good: "Good driver",
  fair: "Fair driver",
  needs_work: "Needs work",
  poor: "Needs improvement",
};

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function DriveScreen() {
  const [driveState, setDriveState] = useState<DriveState>("pre");
  const {
    isReady,
    isRunning,
    events,
    score,
    sessionDurationMs,
    start,
    stop,
    rating,
    sensitivity,
    setSensitivity,
    error,
  } = useDriveSession();

  const eventSummary = useMemo<
    Array<{ type: EventType; count: number; deduction: number }>
  >(() => {
    const summary: Record<
      EventType,
      { type: EventType; count: number; deduction: number }
    > = {} as Record<
      EventType,
      { type: EventType; count: number; deduction: number }
    >;

    for (const event of events as RuntimeDriveEvent[]) {
      const existing = summary[event.type] ?? {
        type: event.type,
        count: 0,
        deduction: 0,
      };

      existing.count += 1;
      existing.deduction += event.deduction;
      summary[event.type] = existing;
    }

    return Object.values(summary).sort((a, b) => b.deduction - a.deduction);
  }, [events]);

  const recentEvents = events as RuntimeDriveEvent[];
  const statusText = isReady
    ? "Sensors ready"
    : "Waiting for permissions or sensor access.";
  const ratingText = ratingTitles[rating];

  const handleStart = async () => {
    const started = await start();
    if (started) {
      setDriveState("active");
    }
  };

  const handleStop = async () => {
    await stop();
    setDriveState("summary");
  };

  const handleDone = () => setDriveState("pre");

  const renderPreDrive = () => (
    <View style={styles.stateContainer}>
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIconWrapper}>
          <Ionicons name="car-outline" size={56} color={theme.colors.primary} />
        </View>
        <Text style={styles.welcomeTitle}>Ready to start your trip?</Text>
        <Text style={styles.welcomeSubtitle}>
          Drive safely, maintain speed limits, and avoid sudden braking to score
          100.
        </Text>
        <Text style={styles.statusText}>{statusText}</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.sensitivitySection}>
          <Text style={styles.sensitivityLabel}>Sensor sensitivity</Text>
          <View style={styles.sensitivityOptionRow}>
            {(["low", "medium", "high"] as SensitivityLevel[]).map((option) => (
              <Pressable
                key={option}
                onPress={() => setSensitivity(option)}
                style={({ pressed }) => [
                  styles.sensitivityOption,
                  sensitivity === option && styles.sensitivityOptionSelected,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    styles.sensitivityOptionText,
                    sensitivity === option &&
                      styles.sensitivityOptionTextSelected,
                  ]}
                >
                  {option === "low"
                    ? "Low"
                    : option === "medium"
                      ? "Medium"
                      : "High"}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.sensitivityHint}>
            Tap to choose how strongly the app detects events.
          </Text>
        </View>
      </View>

      <Button
        title="Start Drive"
        onPress={handleStart}
        variant="success"
        icon={<Ionicons name="play" size={20} color={theme.colors.success} />}
        disabled={!isReady}
        style={styles.actionBtn}
      />
    </View>
  );

  const renderActiveDrive = () => (
    <View style={styles.stateContainer}>
      {/* Recording Indicator */}
      <View style={styles.liveIndicatorContainer}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Recording</Text>
        </View>
      </View>

      {/* Progress ring */}
      <View style={styles.chartWrapper}>
        <CircularProgress
          score={score}
          size={160}
          strokeWidth={12}
          labelText="Live score"
        />
      </View>

      {/* Grid stats */}
      <View style={styles.statsGrid}>
        <StatCard value={formatDuration(sessionDurationMs)} label="Duration" />
        <StatCard
          value={events.length}
          label="Events"
          valueColor={theme.colors.danger}
        />
        <StatCard
          value={`-${100 - score}`}
          label="Deducted"
          valueColor={theme.colors.warning}
        />
      </View>

      {/* Event log */}
      <View style={styles.section}>
        <SectionHeader title="Live events" />
        {recentEvents.length === 0 ? (
          <Text style={styles.emptyText}>No events detected yet.</Text>
        ) : (
          recentEvents.map((event) => {
            const eventInfo = eventCardMap[event.type];
            return (
              <EventCard
                key={event.id}
                type={eventInfo.cardType}
                title={eventInfo.title}
                subtitle={`-${event.deduction} pts · ${formatDuration(
                  event.occurrenceTime,
                )}`}
              />
            );
          })
        )}
      </View>

      <Button
        title="End drive"
        onPress={handleStop}
        variant="danger"
        icon={<Ionicons name="stop" size={18} color={theme.colors.danger} />}
        style={styles.actionBtn}
      />
    </View>
  );

  const renderPostDriveSummary = () => (
    <View style={styles.stateContainer}>
      {/* Progress Ring */}
      <View style={styles.chartWrapper}>
        <CircularProgress
          score={score}
          size={160}
          strokeWidth={12}
          labelText="Final score"
          ratingText={ratingText}
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard value={formatDuration(sessionDurationMs)} label="Duration" />
        <StatCard
          value={events.length}
          label="Events"
          valueColor={theme.colors.warning}
        />
        <StatCard
          value={`-${100 - score}`}
          label="Deducted"
          valueColor={theme.colors.danger}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Event breakdown" />
        {eventSummary.length === 0 ? (
          <Text style={styles.emptyText}>No events recorded this drive.</Text>
        ) : (
          eventSummary.map((summary) => {
            const eventInfo = eventCardMap[summary.type];
            return (
              <EventCard
                key={summary.type}
                type={eventInfo.cardType}
                title={eventInfo.title}
                subtitle={`${summary.count} events`}
                countText={`×${summary.count}`}
                deductText={`-${summary.deduction} pts`}
              />
            );
          })
        )}
      </View>

      <Button
        title="Done"
        onPress={handleDone}
        variant="outline"
        style={styles.actionBtn}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.switcherContainer}>
        {(["pre", "active", "summary"] as DriveState[]).map((state) => {
          const isSelected = driveState === state;
          const labels: Record<DriveState, string> = {
            pre: "Pre-Drive",
            active: "Active Drive",
            summary: "Summary",
          };
          return (
            <Pressable
              key={state}
              onPress={() => setDriveState(state)}
              style={({ pressed }) => [
                styles.switcherTab,
                isSelected && styles.switcherTabSelected,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text
                style={[
                  styles.switcherText,
                  isSelected && styles.switcherTextSelected,
                ]}
              >
                {labels[state]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.navHeader}>
        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && { opacity: 0.7 }]}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
        <Text style={styles.navTitle}>
          {driveState === "pre"
            ? "New Drive"
            : driveState === "active"
              ? "Live Drive"
              : "Drive Summary"}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && { opacity: 0.7 }]}
        >
          <Ionicons
            name={
              driveState === "summary" ? "share-outline" : "settings-outline"
            }
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {driveState === "pre" && renderPreDrive()}
        {driveState === "active" && renderActiveDrive()}
        {driveState === "summary" && renderPostDriveSummary()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  switcherContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 3,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.roundness.md,
    alignItems: "center",
  },
  switcherTabSelected: {
    backgroundColor: theme.colors.primaryLight,
  },
  switcherText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  switcherTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  navIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  stateContainer: {
    gap: 20,
  },
  welcomeCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.xl,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  welcomeIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  statusText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  liveIndicatorContainer: {
    alignItems: "center",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.successLight,
    borderColor: theme.colors.successBorder,
    borderWidth: 0.5,
    borderRadius: theme.roundness.xxl,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  liveText: {
    fontSize: 14,
    color: theme.colors.success,
    fontWeight: "600",
  },
  sensitivitySection: {
    marginTop: 20,
    width: "100%",
  },
  sensitivityLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  sensitivityOptionRow: {
    flexDirection: "row",
    gap: 10,
  },
  sensitivityOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
  },
  sensitivityOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  sensitivityOptionText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "500",
  },
  sensitivityOptionTextSelected: {
    color: theme.colors.primary,
  },
  sensitivityHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  chartWrapper: {
    alignItems: "center",
    marginVertical: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  section: {
    gap: 8,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  actionBtn: {
    marginTop: theme.spacing.sm,
  },
});
