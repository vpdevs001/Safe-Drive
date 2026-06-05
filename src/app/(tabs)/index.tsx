import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { CircularProgress } from "../../components/CircularProgress";
import { EventCard } from "../../components/EventCard";
import { SectionHeader } from "../../components/SectionHeader";
import { StatCard } from "../../components/StatCard";
import { theme } from "../../constants/theme";

type DriveState = "pre" | "active" | "summary";

export default function DriveScreen() {
  const [driveState, setDriveState] = useState<DriveState>("active");

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
      </View>

      <Button
        title="Start Drive"
        onPress={() => setDriveState("active")}
        variant="success"
        icon={<Ionicons name="play" size={20} color={theme.colors.success} />}
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
          score={76}
          size={160}
          strokeWidth={12}
          labelText="Live score"
        />
      </View>

      {/* Grid stats */}
      <View style={styles.statsGrid}>
        <StatCard value="12:34" label="Duration" />
        <StatCard value={7} label="Events" valueColor={theme.colors.danger} />
        <StatCard
          value="-24"
          label="Deducted"
          valueColor={theme.colors.warning}
        />
      </View>

      {/* Event log */}
      <View style={styles.section}>
        <SectionHeader title="Live events" />
        <EventCard
          type="brake"
          title="Harsh brake"
          subtitle="2 events · -10 pts"
        />
        <EventCard
          type="acceleration"
          title="Hard accel."
          subtitle="2 events · -10 pts"
        />
        <EventCard type="turn" title="Sharp turn" subtitle="1 event · -3 pts" />
      </View>

      <Button
        title="End drive"
        onPress={() => setDriveState("summary")}
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
          score={85}
          size={160}
          strokeWidth={12}
          labelText="Final score"
          ratingText="Good driver"
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard value="24:10" label="Duration" />
        <StatCard value={3} label="Events" valueColor={theme.colors.warning} />
        <StatCard
          value="-15"
          label="Deducted"
          valueColor={theme.colors.danger}
        />
      </View>

      {/* Breakdown and AI Feedback */}
      <View style={styles.section}>
        <SectionHeader title="Event breakdown" />
        <EventCard
          type="brake"
          title="Harsh brake"
          subtitle="1 event"
          countText="×1"
          deductText="-5 pts"
        />
        <EventCard
          type="phone"
          title="Phone handling"
          subtitle="1 event"
          countText="×1"
          deductText="-10 pts"
        />
      </View>

      <Button
        title="Done"
        onPress={() => setDriveState("pre")}
        variant="outline"
        style={styles.actionBtn}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Demo State Switcher */}
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

      {/* Main Nav Header */}
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
  actionBtn: {
    marginTop: theme.spacing.sm,
  },
});
