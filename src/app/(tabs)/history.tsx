import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryItem } from "../../components/HistoryItem";
import { SectionHeader } from "../../components/SectionHeader";
import { StatCard } from "../../components/StatCard";
import { TrendChart } from "../../components/TrendChart";
import { theme } from "../../constants/theme";
import { useSessionHistory } from "../../hooks/useSessionHistory";

const ratingLabelMap: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  needs_work: "Needs work",
  poor: "Poor",
  pending: "Pending",
};

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatSessionMeta = (durationMs?: number, eventCount?: number) => {
  const duration = durationMs ? formatDuration(durationMs) : "No duration";
  return `${duration} · ${eventCount ?? 0} events`;
};

const createTrendData = (
  sessions: Array<{ startedAt: number; score: number }>,
) => {
  const today = new Date();
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = date.toDateString();
    const scores = sessions
      .filter((session) => new Date(session.startedAt).toDateString() === key)
      .map((session) => session.score);

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, value) => sum + value, 0) / scores.length,
          )
        : 0;

    return {
      day: dayNames[date.getDay()],
      score: averageScore,
      isActive: key === today.toDateString(),
    };
  });
};

export default function HistoryScreen() {
  const { sessions, loading } = useSessionHistory();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const totalDrives = sessions.length;
  const averageScore = totalDrives
    ? Math.round(
        sessions.reduce((sum, session) => sum + session.score, 0) / totalDrives,
      )
    : 0;
  const totalEvents = sessions.reduce(
    (sum, session) => sum + session.eventCount,
    0,
  );

  const trendData = useMemo(() => createTrendData(sessions), [sessions]);
  const filterChips = ["All", "This week", "Best", "Worst"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <Text style={styles.navTitle}>Drive history</Text>
        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && { opacity: 0.7 }]}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TrendChart data={trendData} />

        <View style={styles.summaryRow}>
          <StatCard
            value={averageScore || "—"}
            label="Avg score"
            valueColor={theme.colors.success}
          />
          <StatCard value={totalDrives || "—"} label="Drives" />
          <StatCard
            value={totalEvents || "—"}
            label="Events"
            valueColor={theme.colors.danger}
          />
        </View>

        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filterChips.map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextSelected,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <SectionHeader title="Recent drives" />

        {loading ? (
          <Text style={styles.emptyText}>Loading drive history…</Text>
        ) : sessions.length === 0 ? (
          <Text style={styles.emptyText}>No drives recorded yet.</Text>
        ) : (
          <View style={styles.listSection}>
            {sessions.map((session) => {
              const title = session.name
                ? session.name
                : new Date(session.startedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

              return (
                <HistoryItem
                  key={session.id}
                  score={session.score}
                  title={title}
                  meta={formatSessionMeta(
                    session.durationMs,
                    session.eventCount,
                  )}
                  badgeText={ratingLabelMap[session.rating ?? "pending"]}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.roundness.xxl,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterChipSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primaryBorder,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: theme.spacing.lg,
  },
  listSection: {
    paddingHorizontal: 16,
  },
});
