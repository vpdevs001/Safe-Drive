import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { theme } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#185fa5",
          borderColor: "#1e3a5a",
          borderWidth: 1,
        };
      case "success":
        return {
          backgroundColor: theme.colors.successLight,
          borderColor: theme.colors.successBorder,
          borderWidth: 0.5,
        };
      case "danger":
        return {
          backgroundColor: theme.colors.dangerLight,
          borderColor: theme.colors.dangerBorder,
          borderWidth: 0.5,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: theme.colors.border,
          borderWidth: 0.5,
        };
      case "ghost":
      default:
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textSecondary;
    switch (variant) {
      case "primary":
        return "#b5d4f4";
      case "success":
        return theme.colors.success;
      case "danger":
        return theme.colors.danger;
      case "outline":
        return theme.colors.text;
      case "ghost":
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        getButtonStyles(),
        disabled && styles.disabled,
        pressed && !disabled && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              icon ? { marginLeft: 8 } : {},
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.roundness.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: theme.fontSizes.md,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
