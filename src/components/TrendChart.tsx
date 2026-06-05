import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

interface DayData {
  day: string;
  score: number; // percentage 0 to 100
  isActive?: boolean;
}

interface TrendChartProps {
  data: DayData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Weekly avg score</Text>
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const barHeight = `${item.score}%` as any;
          const barColor = item.isActive ? theme.colors.primary : theme.colors.border;
          
          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  item.isActive && { color: theme.colors.primary, fontWeight: "600" },
                ]}
              >
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80,
    justifyContent: "space-between",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 3,
  },
  barBg: {
    height: 56,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    borderRadius: theme.roundness.sm,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },
});
