import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryItem } from "../../components/HistoryItem";
import { SectionHeader } from "../../components/SectionHeader";
import { StatCard } from "../../components/StatCard";
import { TrendChart } from "../../components/TrendChart";
import { theme } from "../../constants/theme";

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
        {/* Trend Chart */}
        <TrendChart data={trendData} />

        {/* Summary grid */}
        <View style={styles.summaryRow}>
          <StatCard
            value="87"
            label="Avg score"
            valueColor={theme.colors.success}
          />
          <StatCard value="7" label="Drives" />
          <StatCard
            value="12"
            label="Events"
            valueColor={theme.colors.danger}
          />
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
          <SectionHeader title="Recent drives" />
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
  listSection: {
    paddingHorizontal: 16,
  },
});
