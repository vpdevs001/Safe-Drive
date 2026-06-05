import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.sm,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
