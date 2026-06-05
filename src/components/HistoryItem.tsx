import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

interface HistoryItemProps {
  score: number;
  title: string;
  meta: string;
  badgeText: string;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  score,
  title,
  meta,
  badgeText,
}) => {
  // Determine color theme based on score
  let scoreColor = theme.colors.success;
  let bgBadgeColor = theme.colors.successLight;
  let textBadgeColor = theme.colors.success;

  if (score < 70) {
    scoreColor = theme.colors.danger;
    bgBadgeColor = theme.colors.dangerLight;
    textBadgeColor = theme.colors.danger;
  } else if (score < 85) {
    scoreColor = theme.colors.warning;
    bgBadgeColor = theme.colors.warningLight;
    textBadgeColor = theme.colors.warning;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.scoreRing, { borderColor: scoreColor }]}>
        <Text style={styles.scoreNumber}>{score}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: bgBadgeColor }]}>
        <Text style={[styles.badgeText, { color: textBadgeColor }]}>
          {badgeText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 6,
    gap: 8,
  },
  scoreRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.text,
  },
  meta: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: theme.roundness.md,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "600",
  },
});
