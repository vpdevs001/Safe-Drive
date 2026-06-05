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
          <Ionicons name="settings-outline" size={20} color={theme.colors.textSecondary} />
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
            <Ionicons name="ribbon-outline" size={16} color={theme.colors.success} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 2.5,
    borderColor: "#185fa5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  userSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.successLight,
    borderWidth: 0.5,
    borderColor: theme.colors.successBorder,
    borderRadius: theme.roundness.xxl,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 12,
    gap: 6,
  },
  streakText: {
    fontSize: 13,
    color: theme.colors.success,
    fontWeight: "600",
  },
  statsGrid: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  settingsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  settingsHeader: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.lg,
    overflow: "hidden",
  },
});
