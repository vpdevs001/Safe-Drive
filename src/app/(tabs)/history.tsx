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
import { TrendChart } from "../../components/TrendChart";
import { StatCard } from "../../components/StatCard";
import { HistoryItem } from "../../components/HistoryItem";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const trendData = [
    { day: "M", score: 60 },
    { day: "T", score: 75 },
    { day: "W", score: 55 },
    { day: "T", score: 82 },
    { day: "F", score: 70 },
    { day: "S", score: 88 },
    { day: "S", score: 92, isActive: true },
  ];

  const filterChips = ["All", "This week", "Best", "Worst"];

  const historyDrives = [
    {
      score: 92,
      title: "Morning commute",
      meta: "Today · 18 min · 8.2 km",
      badgeText: "Excellent",
    },
    {
      score: 74,
      title: "Evening drive",
      meta: "Yesterday · 32 min",
      badgeText: "Fair",
    },
    {
      score: 85,
      title: "Weekend trip",
      meta: "Sat · 1h 12 min",
      badgeText: "Good",
    },
    {
      score: 61,
      title: "Night drive",
      meta: "Fri · 24 min",
      badgeText: "Needs work",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <Text style={styles.navTitle}>Drive history</Text>
        <Pressable
          style={({ pressed }) => [
            styles.navIcon,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="calendar-outline" size={15} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Trend Chart */}
        <TrendChart data={trendData} />

        {/* Summary grid */}
        <View style={styles.summaryRow}>
          <StatCard value="87" label="Avg score" valueColor={theme.colors.success} />
          <StatCard value="7" label="Drives" />
          <StatCard value="12" label="Events" valueColor={theme.colors.danger} />
        </View>

        {/* Filter chips */}
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

        {/* History list */}
        <View style={styles.listSection}>
          {historyDrives.map((drive, index) => (
            <HistoryItem
              key={index}
              score={drive.score}
              title={drive.title}
              meta={drive.meta}
              badgeText={drive.badgeText}
            />
          ))}
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  navIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterRow: {
    paddingHorizontal: 12,
    gap: 5,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  filterChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
  listSection: {
    paddingHorizontal: 12,
  },
});
