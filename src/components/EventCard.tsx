import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export type EventType = "brake" | "acceleration" | "turn" | "phone";

interface EventCardProps {
  type: EventType;
  title: string;
  subtitle: string;
  countText?: string;
  deductText?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  type,
  title,
  subtitle,
  countText,
  deductText,
}) => {
  const getColors = () => {
    switch (type) {
      case "brake":
        return {
          bg: theme.colors.dangerLight,
          color: theme.colors.danger,
          iconName: "trending-down-outline" as const,
        };
      case "acceleration":
        return {
          bg: theme.colors.warningLight,
          color: theme.colors.warning,
          iconName: "trending-up-outline" as const,
        };
      case "turn":
        return {
          bg: theme.colors.primaryLight,
          color: theme.colors.primary,
          iconName: "refresh-outline" as const,
        };
      case "phone":
        return {
          bg: theme.colors.pinkLight,
          color: theme.colors.pink,
          iconName: "phone-portrait-outline" as const,
        };
    }
  };

  const styleConfig = getColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: styleConfig.bg }]}>
        <Ionicons name={styleConfig.iconName} size={15} color={styleConfig.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {(countText || deductText) && (
        <View style={styles.rightContainer}>
          {countText && (
            <Text style={[styles.count, { color: styleConfig.color }]}>
              {countText}
            </Text>
          )}
          {deductText && <Text style={styles.deduct}>{deductText}</Text>}
        </View>
      )}
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
    padding: 10,
    marginBottom: 6,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: theme.roundness.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  count: {
    fontSize: 13,
    fontWeight: "500",
  },
  deduct: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
});
