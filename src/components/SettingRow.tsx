import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
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
  const renderContent = () => (
    <>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {valueText && <Text style={styles.valueText}>{valueText}</Text>}
      </View>

      {hasToggle ? (
        <Pressable
          onPress={onToggle}
          style={({ pressed }) => [
            styles.toggleContainer,
            toggleValue ? styles.toggleOn : styles.toggleOff,
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={styles.toggleKnob} />
        </Pressable>
      ) : (
        onPress && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textSecondary}
            style={styles.chevron}
          />
        )
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          !isLast && styles.borderBottom,
          pressed && { opacity: 0.7 },
        ]}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, !isLast && styles.borderBottom]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: theme.roundness.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: "500",
  },
  valueText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    marginLeft: "auto",
  },
  toggleContainer: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.text,
  },
});
