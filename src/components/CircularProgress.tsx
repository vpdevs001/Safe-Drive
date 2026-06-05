import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { theme } from "../constants/theme";

interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  labelText?: string;
  ratingText?: string;
  ratingColorBg?: string;
  ratingColorText?: string;
  ratingBorderColor?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  score,
  size = 130,
  strokeWidth = 10,
  showLabel = true,
  labelText = "Live score",
  ratingText,
  ratingColorBg,
  ratingColorText,
  ratingBorderColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine colors based on score if not explicitly passed
  let progressColor = theme.colors.success;
  let rating = ratingText || "Good";
  let bgRatingColor = ratingColorBg || theme.colors.successLight;
  let textRatingColor = ratingColorText || theme.colors.success;
  let borderRatingColor = ratingBorderColor || theme.colors.successBorder;

  if (score < 70) {
    progressColor = theme.colors.danger;
    rating = ratingText || "Needs work";
    bgRatingColor = ratingColorBg || theme.colors.dangerLight;
    textRatingColor = ratingColorText || theme.colors.danger;
    borderRatingColor = ratingBorderColor || theme.colors.dangerBorder;
  } else if (score < 85) {
    progressColor = theme.colors.warning;
    rating = ratingText || "Fair";
    bgRatingColor = ratingColorBg || theme.colors.warningLight;
    textRatingColor = ratingColorText || theme.colors.warning;
    borderRatingColor = ratingBorderColor || theme.colors.warningBorder;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.colors.card}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.content}>
        <Text style={styles.scoreText}>{score}</Text>
        {showLabel && <Text style={styles.labelText}>{labelText}</Text>}
        {rating && (
          <View
            style={[
              styles.ratingBadge,
              {
                backgroundColor: bgRatingColor,
                borderColor: borderRatingColor,
              },
            ]}
          >
            <Text style={[styles.ratingText, { color: textRatingColor }]}>
              {rating}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "600",
    color: theme.colors.text,
  },
  labelText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  ratingBadge: {
    borderWidth: 0.5,
    borderRadius: theme.roundness.xxl,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: "600",
  },
});
