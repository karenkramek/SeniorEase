import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/presentation/components/HapticTab";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { Colors } from "@/presentation/theme/colors";
import { getNavigationIcon } from "@/presentation/utils/navigationIcons";

export default function TabLayout() {
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
        name="TaskListScreen"
        options={{
          title: "Tarefas",
          tabBarLabel: "Tarefas",
          tabBarAccessibilityLabel: "Aba de tarefas",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={getNavigationIcon("TaskListScreen", focused)}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="PreferencesScreen"
        options={{
          tabBarLabel: "Preferências",
          tabBarAccessibilityLabel: "Aba de preferências",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={getNavigationIcon("PreferencesScreen", focused)}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="HelpScreen"
        options={{
          tabBarLabel: "Ajuda",
          tabBarAccessibilityLabel: "Aba de ajuda e dicas",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={getNavigationIcon("HelpScreen", focused)}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
