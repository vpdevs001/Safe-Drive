import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { Button } from "../../components/Button";
import { CircularProgress } from "../../components/CircularProgress";
import { StatCard } from "../../components/StatCard";
import { EventCard } from "../../components/EventCard";
import { SafeAreaView } from "react-native-safe-area-context";

type DriveState = "pre" | "active" | "summary";

export default function DriveScreen() {
  const [driveState, setDriveState] = useState<DriveState>("active");

  const renderPreDrive = () => (
    <View style={styles.stateContainer}>
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIconWrapper}>
          <Ionicons name="car-outline" size={48} color={theme.colors.primary} />
        </View>
        <Text style={styles.welcomeTitle}>Ready to start your trip?</Text>
        <Text style={styles.welcomeSubtitle}>
          Drive safely, maintain speed limits, and avoid sudden braking to score 100.
        </Text>
      </View>

      <Button
        title="Start Drive"
        onPress={() => setDriveState("active")}
        variant="success"
        icon={<Ionicons name="play" size={16} color={theme.colors.success} />}
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
          size={130}
          strokeWidth={10}
          labelText="Live score"
        />
      </View>

      {/* Grid stats */}
      <View style={styles.statsGrid}>
        <StatCard value="12:34" label="Duration" />
        <StatCard value={7} label="Events" valueColor={theme.colors.danger} />
        <StatCard value="-24" label="Deducted" valueColor={theme.colors.warning} />
      </View>

      {/* Event log */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Live events</Text>
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
        <EventCard
          type="turn"
          title="Sharp turn"
          subtitle="1 event · -3 pts"
        />
      </View>

      <Button
        title="End drive"
        onPress={() => setDriveState("summary")}
        variant="danger"
        icon={<Ionicons name="stop" size={14} color={theme.colors.danger} />}
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
          size={130}
          strokeWidth={10}
          labelText="Final score"
          ratingText="Good driver"
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard value="24:10" label="Duration" />
        <StatCard value={3} label="Events" valueColor={theme.colors.warning} />
        <StatCard value="-15" label="Deducted" valueColor={theme.colors.danger} />
      </View>

      {/* Breakdown and AI Feedback */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Event breakdown</Text>
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

        {/* AI Card */}
        <View style={styles.aiCard}>
          <Text style={styles.aiHeader}>AI feedback</Text>
          <Text style={styles.aiBody}>
            Good overall drive. Watch for phone usage — even brief checks triple
            accident risk.
          </Text>
        </View>
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
          style={({ pressed }) => [
            styles.navIcon,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="arrow-back" size={16} color={theme.colors.textSecondary} />
        </Pressable>
        <Text style={styles.navTitle}>
          {driveState === "pre"
            ? "New Drive"
            : driveState === "active"
            ? "Live Drive"
            : "Drive Summary"}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.navIcon,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name={driveState === "summary" ? "share-outline" : "settings-outline"}
            size={16}
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
    borderRadius: theme.roundness.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 2,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: theme.roundness.sm,
    alignItems: "center",
  },
  switcherTabSelected: {
    backgroundColor: theme.colors.primaryLight,
  },
  switcherText: {
    fontSize: 9,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  switcherTextSelected: {
    color: theme.colors.primary,
  },
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.text,
  },
  navIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  stateContainer: {
    gap: 16,
  },
  welcomeCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.xl,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  welcomeIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  liveText: {
    fontSize: 11,
    color: theme.colors.success,
    fontWeight: "500",
  },
  chartWrapper: {
    alignItems: "center",
    marginVertical: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  section: {
    gap: 6,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  aiCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: 12,
    marginTop: 6,
  },
  aiHeader: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  aiBody: {
    fontSize: 12,
    color: theme.colors.text,
    lineHeight: 18,
  },
  actionBtn: {
    marginTop: 8,
  },
});
