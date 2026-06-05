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
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 60,
    justifyContent: "space-between",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  barBg: {
    height: 40,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    borderRadius: theme.roundness.sm,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 3,
  },
  dayLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
});
