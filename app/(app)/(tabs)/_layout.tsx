import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/presentation/components/HapticTab";
import { useTheme } from "@/presentation/hooks/useTheme";
import { getNavigationIcon } from "@/presentation/utils/icons";

export default function TabLayout() {
  const { themeColors } = useTheme();

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
          title: "Tarefas",
          tabBarLabel: "Tarefas",
          tabBarAccessibilityLabel: "Aba de tarefas",
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
          title: "Preferências",
          tabBarLabel: "Preferências",
          tabBarAccessibilityLabel: "Aba de preferências",
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
          title: "Ajuda",
          tabBarLabel: "Ajuda",
          tabBarAccessibilityLabel: "Aba de ajuda e dicas",
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
