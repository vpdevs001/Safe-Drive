import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { Button } from "../../components/Button";
import { CircularProgress } from "../../components/CircularProgress";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupScreen() {
  const router = useRouter();
  const [name, setName] = useState("Rahul S.");
  const [experience, setExperience] = useState("Experienced");
  const [typicalDrive, setTypicalDrive] = useState("City");

  const handleFinish = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timeText}>9:41</Text>
        <Text style={styles.networkText}>▮▮▮</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <Text style={styles.overline}>QUICK SETUP</Text>
          <Text style={styles.title}>Tell us about{"\n"}yourself</Text>
        </View>

        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Your name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={theme.colors.textSecondary}
              />
              <Ionicons
                name="pencil-sharp"
                size={12}
                color={theme.colors.textSecondary}
              />
            </View>
          </View>

          {/* Experience Chips */}
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Experience level</Text>
            <View style={styles.chipRow}>
              {["New driver", "Experienced", "Professional"].map((exp) => {
                const isSelected = experience === exp;
                return (
                  <Pressable
                    key={exp}
                    onPress={() => setExperience(exp)}
                    style={({ pressed }) => [
                      styles.chip,
                      isSelected && styles.chipSelected,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {exp}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Typical Drive Chips */}
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Typical drive</Text>
            <View style={styles.chipRow}>
              {["City", "Highway", "Mixed"].map((drive) => {
                const isSelected = typicalDrive === drive;
                return (
                  <Pressable
                    key={drive}
                    onPress={() => setTypicalDrive(drive)}
                    style={({ pressed }) => [
                      styles.chip,
                      isSelected && styles.chipSelected,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {drive}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Starting Score Preview */}
          <View style={styles.scorePreview}>
            <CircularProgress
              score={100}
              size={40}
              strokeWidth={3}
              showLabel={false}
              ratingText=""
            />
            <View style={styles.scorePreviewText}>
              <Text style={styles.scorePreviewTitle}>Starting score</Text>
              <Text style={styles.scorePreviewSubtitle}>
                Every drive starts at 100
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <Button
          title="Start my first drive"
          onPress={handleFinish}
          variant="success"
          style={styles.primaryBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  timeText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  networkText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  overline: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    gap: 12,
  },
  rowContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    height: 36,
  },
  textInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 12,
  },
  chipRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.roundness.xxl,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  chipSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primaryBorder,
  },
  chipText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: theme.colors.primary,
  },
  scorePreview: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  scorePreviewText: {
    marginLeft: 10,
  },
  scorePreviewTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.text,
  },
  scorePreviewSubtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.border,
  },
  activeDot: {
    width: 14,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  primaryBtn: {
    marginBottom: 8,
  },
});
