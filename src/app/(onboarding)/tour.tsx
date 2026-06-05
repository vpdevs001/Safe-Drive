import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { EventCard } from "../../components/EventCard";
import { theme } from "../../constants/theme";

export default function TourScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/(onboarding)/permissions");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timeText}>9:41</Text>
        <Text style={styles.networkText}>▮▮▮</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <Text style={styles.overline}>WHAT WE DETECT</Text>
          <Text style={styles.title}>
            Your phone already knows{"\n"}how you drive
          </Text>
        </View>

        <View style={styles.featuresList}>
          <EventCard
            type="brake"
            title="Harsh braking"
            subtitle="Sudden deceleration via accelerometer"
          />
          <EventCard
            type="acceleration"
            title="Hard acceleration"
            subtitle="Rapid speed gain detection"
          />
          <EventCard
            type="turn"
            title="Sharp turns"
            subtitle="Gyroscope & rotation rate"
          />
          <EventCard
            type="phone"
            title="Phone handling"
            subtitle="Motion patterns while driving"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Button
          title="Next"
          onPress={handleNext}
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
    fontSize: 26,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    lineHeight: 32,
  },
  featuresList: {
    gap: 10,
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
