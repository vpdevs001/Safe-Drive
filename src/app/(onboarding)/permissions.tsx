import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { Button } from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PermissionsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleContinue = () => {
    router.push("/(onboarding)/setup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timeText}>9:41</Text>
        <Text style={styles.networkText}>▮▮▮</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <Text style={styles.overline}>PERMISSIONS NEEDED</Text>
          <Text style={styles.title}>A few things we need</Text>
          <Text style={styles.description}>
            All data stays on your device. We never share it.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Card 1: Motion Sensors */}
          <View style={styles.card}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="hardware-chip-outline" size={14} color={theme.colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Motion sensors</Text>
              <Text style={styles.cardSubtitle}>Accelerometer, gyroscope</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} style={styles.checkIcon} />
          </View>

          {/* Card 2: Location */}
          <View style={styles.card}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.successLight }]}>
              <Ionicons name="map-outline" size={14} color={theme.colors.success} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Location</Text>
              <Text style={styles.cardSubtitle}>Route mapping (optional)</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} style={styles.checkIcon} />
          </View>

          {/* Card 3: Notifications */}
          <View style={styles.card}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.colors.warningLight }]}>
              <Ionicons name="notifications-outline" size={14} color={theme.colors.warning} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Notifications</Text>
              <Text style={styles.cardSubtitle}>Drive start reminders</Text>
            </View>
            <Pressable
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              style={({ pressed }) => [
                styles.toggleContainer,
                notificationsEnabled ? styles.toggleOn : styles.toggleOff,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.toggleKnob} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <Button
          title="Allow & continue"
          onPress={handleContinue}
          variant="primary"
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
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  cardsContainer: {
    gap: 8,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: theme.roundness.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.text,
  },
  cardSubtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
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
