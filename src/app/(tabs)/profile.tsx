import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { StatCard } from "../../components/StatCard";
import { SettingRow } from "../../components/SettingRow";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <Text style={styles.navTitle}>My profile</Text>
        <Pressable
          style={({ pressed }) => [
            styles.navIcon,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="settings-outline" size={15} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RS</Text>
          </View>
          <Text style={styles.userName}>Rahul S.</Text>
          <Text style={styles.userSubtitle}>Experienced · City driver</Text>

          {/* Streak Badge */}
          <View style={styles.streakBadge}>
            <Ionicons name="ribbon-outline" size={12} color={theme.colors.success} />
            <Text style={styles.streakText}>Safe driver streak: 5 drives</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard value="87" label="Avg score" valueColor={theme.colors.success} />
            <StatCard value="24" label="Total drives" />
          </View>
          <View style={styles.statsRow}>
            <StatCard value="312 km" label="Total distance" />
            <StatCard value="18" label="Total events" valueColor={theme.colors.danger} />
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsHeader}>Settings</Text>
          <View style={styles.settingsCard}>
            <SettingRow
              iconName="hardware-chip-outline"
              iconBg={theme.colors.primaryLight}
              iconColor={theme.colors.primary}
              label="Sensor sensitivity"
              valueText="Medium"
              onPress={() => {}}
            />
            <SettingRow
              iconName="notifications-outline"
              iconBg={theme.colors.successLight}
              iconColor={theme.colors.success}
              label="Event alerts"
              hasToggle
              toggleValue={alertsEnabled}
              onToggle={() => setAlertsEnabled(!alertsEnabled)}
            />
            <SettingRow
              iconName="map-outline"
              iconBg={theme.colors.warningLight}
              iconColor={theme.colors.warning}
              label="Location tracking"
              valueText="Optional"
              hasToggle
              toggleValue={locationEnabled}
              onToggle={() => setLocationEnabled(!locationEnabled)}
            />
            <SettingRow
              iconName="download-outline"
              iconBg={theme.colors.pinkLight}
              iconColor={theme.colors.pink}
              label="Export drive data"
              onPress={() => {}}
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  navIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 2,
    borderColor: "#185fa5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  userSubtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.successLight,
    borderWidth: 0.5,
    borderColor: theme.colors.successBorder,
    borderRadius: theme.roundness.xxl,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    gap: 5,
  },
  streakText: {
    fontSize: 10,
    color: theme.colors.success,
    fontWeight: "500",
  },
  statsGrid: {
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 6,
  },
  settingsSection: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  settingsHeader: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  settingsCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    overflow: "hidden",
  },
});
