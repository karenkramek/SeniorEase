import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/presentation/components/HapticTab";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { Colors } from "@/presentation/theme/colors";
import { getNavigationIcon } from "@/presentation/utils/icons";

export default function TabLayout() {
  const appTexts = useAppStrings();
  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tabIconSelected,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.icon,
        },
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          title: appTexts.navigation.tasksTabTitle,
          tabBarLabel: appTexts.navigation.tasksTabTitle,
          tabBarAccessibilityLabel: appTexts.navigation.tasksTabA11y,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={getNavigationIcon("tasks", focused)}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: appTexts.navigation.preferencesTabTitle,
          tabBarLabel: appTexts.navigation.preferencesTabTitle,
          tabBarAccessibilityLabel: appTexts.navigation.preferencesTabA11y,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={getNavigationIcon("preferences", focused)}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: appTexts.navigation.helpTabTitle,
          tabBarLabel: appTexts.navigation.helpTabTitle,
          tabBarAccessibilityLabel: appTexts.navigation.helpTabA11y,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={getNavigationIcon("help", focused)}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarAccessibilityLabel: "Aba de perfil do usuário",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={getNavigationIcon("profile", focused)}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
