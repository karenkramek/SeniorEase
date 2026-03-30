import { Ionicons } from "@expo/vector-icons";
import { BottomTabBar, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { AppHeader } from "@/presentation/components/AppHeader";
import { HapticTab } from "@/presentation/components/HapticTab";
import { WebSidebar } from "@/presentation/components/WebSidebar";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { isWebPlatform, resolveThemeColors } from "@/presentation/theme/colors";
import { getNavigationIcon } from "@/presentation/utils/icons";

function TabBarForPlatform(props: BottomTabBarProps) {
  if (Platform.OS === "web") {
    return null;
  }
  return <BottomTabBar {...props} />;
}

export default function TabLayout() {
  const appTexts = useAppStrings();
  const { preferences } = usePreferences();
  const isWeb = isWebPlatform();
  const themeColors = resolveThemeColors(
    preferences.theme,
    preferences.isHighContrast,
    isWeb,
  );

  const tabs = (
    <Tabs
      tabBar={TabBarForPlatform}
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
          title: appTexts.navigation.profileTabTitle,
          tabBarLabel: appTexts.navigation.profileTabTitle,
          tabBarAccessibilityLabel: appTexts.navigation.profileTabA11y,
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

  if (isWeb) {
    return (
      <View style={{ flex: 1, width: "100%", alignItems: "center", backgroundColor: "#F1F5F9" }}>
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 1200,
            flexDirection: "column",
          }}
        >
          <AppHeader />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <WebSidebar />
            <View style={{ flex: 1, minWidth: 0 }}>{tabs}</View>
          </View>
        </View>
      </View>
    );
  }

  return tabs;
}
