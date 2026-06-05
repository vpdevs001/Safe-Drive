import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

interface StatCardProps {
  value: string | number;
  label: string;
  valueColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  valueColor = theme.colors.text,
}) => {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 3,
    textAlign: "center",
  },
});
