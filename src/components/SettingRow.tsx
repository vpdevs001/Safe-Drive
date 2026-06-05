import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

interface SettingRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  valueText?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  isLast?: boolean;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  iconName,
  iconBg,
  iconColor,
  label,
  valueText,
  hasToggle = false,
  toggleValue = false,
  onToggle,
  onPress,
  isLast = false,
}) => {
  const Container: React.ComponentType<any> = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.row, !isLast && styles.borderBottom]}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={13} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {valueText && <Text style={styles.valueText}>{valueText}</Text>}
      </View>

      {hasToggle ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggle}
          style={[
            styles.toggleContainer,
            toggleValue ? styles.toggleOn : styles.toggleOff,
          ]}
        >
          <View style={styles.toggleKnob} />
        </TouchableOpacity>
      ) : (
        onPress && (
          <Ionicons
            name="chevron-forward"
            size={12}
            color={theme.colors.textSecondary}
            style={styles.chevron}
          />
        )
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#1c1f29",
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: theme.roundness.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "400",
  },
  valueText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  chevron: {
    marginLeft: "auto",
  },
  toggleContainer: {
    width: 28,
    height: 16,
    borderRadius: 8,
    padding: 2,
    justifyContent: "center",
    marginLeft: "auto",
  },
  toggleOn: {
    backgroundColor: theme.colors.primary,
    alignItems: "flex-end",
  },
  toggleOff: {
    backgroundColor: theme.colors.border,
    alignItems: "flex-start",
  },
  toggleKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.text,
  },
});
