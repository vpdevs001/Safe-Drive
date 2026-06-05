/**
 * AsyncStorage Preferences Wrapper
 * Handles user profile and settings persistence
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, UserSettings } from "../types/session";

const STORAGE_KEYS = {
  ONBOARDED: "@safe_drive/onboarded",
  PROFILE: "@safe_drive/profile",
  SETTINGS: "@safe_drive/settings",
};

/**
 * Check if user has completed onboarding
 */
export const getOnboardingStatus = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED);
    return value === "true";
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    return false;
  }
};

/**
 * Mark user as onboarded
 */
export const setOnboarded = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, "true");
  } catch (error) {
    console.error("Error setting onboarded:", error);
    throw error;
  }
};

/**
 * Reset onboarding status (for testing)
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDED);
  } catch (error) {
    console.error("Error resetting onboarding:", error);
    throw error;
  }
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!value) return null;
    return JSON.parse(value) as UserProfile;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
};

/**
 * Save user profile
 */
export const setProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const now = Date.now();
    const toSave: UserProfile = {
      ...profile,
      createdAt: profile.createdAt || now,
      updatedAt: now,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(toSave));
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};

/**
 * Update user profile (partial)
 */
export const updateProfile = async (
  updates: Partial<UserProfile>,
): Promise<UserProfile> => {
  try {
    const existing = await getProfile();
    if (!existing) {
      throw new Error("No profile exists. Create one first with setProfile()");
    }

    const updated: UserProfile = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    await setProfile(updated);
    return updated;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Get user settings
 */
export const getSettings = async (): Promise<UserSettings> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!value) {
      // Return defaults if not yet set
      return getDefaultSettings();
    }
    return JSON.parse(value) as UserSettings;
  } catch (error) {
    console.error("Error getting settings:", error);
    return getDefaultSettings();
  }
};

/**
 * Save user settings
 */
export const setSettings = async (settings: UserSettings): Promise<void> => {
  try {
    const toSave: UserSettings = {
      ...settings,
      updatedAt: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(toSave));
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

/**
 * Update user settings (partial)
 */
export const updateSettings = async (
  updates: Partial<UserSettings>,
): Promise<UserSettings> => {
  try {
    const existing = await getSettings();
    const updated: UserSettings = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };
    await setSettings(updated);
    return updated;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

/**
 * Update sensitivity setting
 */
export const setSensitivity = async (
  sensitivity: "low" | "medium" | "high",
): Promise<UserSettings> => {
  return updateSettings({ sensitivity });
};

/**
 * Toggle alerts
 */
export const setAlertsEnabled = async (
  enabled: boolean,
): Promise<UserSettings> => {
  return updateSettings({ alertsEnabled: enabled });
};

/**
 * Toggle location
 */
export const setLocationEnabled = async (
  enabled: boolean,
): Promise<UserSettings> => {
  return updateSettings({ locationEnabled: enabled });
};

/**
 * Clear all preferences (for testing/reset)
 */
export const clearAllPreferences = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ONBOARDED,
      STORAGE_KEYS.PROFILE,
      STORAGE_KEYS.SETTINGS,
    ]);
  } catch (error) {
    console.error("Error clearing preferences:", error);
    throw error;
  }
};

/**
 * Get default settings
 */
const getDefaultSettings = (): UserSettings => ({
  sensitivity: "medium",
  alertsEnabled: true,
  locationEnabled: false,
  updatedAt: Date.now(),
});

/**
 * Initialize default settings if they don't exist
 */
export const initializeDefaultSettings = async (): Promise<UserSettings> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (existing) {
      return JSON.parse(existing) as UserSettings;
    }

    const defaults = getDefaultSettings();
    await setSettings(defaults);
    return defaults;
  } catch (error) {
    console.error("Error initializing default settings:", error);
    return getDefaultSettings();
  }
};
