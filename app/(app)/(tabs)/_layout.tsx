import { Ionicons } from "@expo/vector-icons";
import { BottomTabBar, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/presentation/components/AppHeader";
import { HapticTab } from "@/presentation/components/HapticTab";
import { MobileMenuDrawer } from "@/presentation/components/MobileMenuDrawer";
import { NavigationMenu } from "@/presentation/components/NavigationMenu";
import { WebSidebar } from "@/presentation/components/WebSidebar";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { isWebPlatform, resolveThemeColors } from "@/presentation/theme/colors";
import { getNavigationIcon } from "@/presentation/utils/icons";

function TabBarForPlatform(props: BottomTabBarProps) {
  if (Platform.OS === "web") {
    return null;
  }
  const bgColor = (props.descriptors[props.state.routes[props.state.index].key]?.options?.tabBarStyle?.backgroundColor as string) || "#fff";
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: bgColor }}>
      <BottomTabBar {...props} />
    </SafeAreaView>
  );
}

function WebBottomTabBar(props: BottomTabBarProps) {
  return <BottomTabBar {...props} />;
}

export default function TabLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const appTexts = useAppStrings();
  const { preferences } = usePreferences();
  const isWeb = isWebPlatform();
  const insets = useSafeAreaInsets();
  const themeColors = resolveThemeColors(
    preferences.theme,
    preferences.isHighContrast,
    isWeb,
  );

  // Breakpoints para web:
  // sm = < 640px (mobile web)
  // md = 640px-1023px (tablet)
  // lg = >= 1024px (desktop)
  const isSmallScreen = screenWidth < 640;
  const isMediumScreen = screenWidth >= 640 && screenWidth < 1024;
  const isLargeScreen = screenWidth >= 1024;
  const showSidebarPermanent = isLargeScreen;
  const showDrawerMenu = isMediumScreen;
  const showBottomTabBar = isSmallScreen && isWeb;

  // Em mobile (não web), usar safe area bottom para a barra de abas
  const tabBarBottomInset = isWeb && showBottomTabBar ? 0 : insets.bottom;

  const tabs = (
    <Tabs
      tabBar={showBottomTabBar ? WebBottomTabBar : TabBarForPlatform}
      screenOptions={{
        tabBarActiveTintColor: themeColors.tabIconSelected,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.icon,
          height: showBottomTabBar ? 65 : 60,
          paddingBottom: tabBarBottomInset,
          elevation: 0,
          shadowColor: 'transparent',
        },
        tabBarLabelStyle: showBottomTabBar ? {
          fontSize: 12,
          paddingBottom: 2,
          paddingTop: 0,
          margin: 0,
        } : {
          fontSize: 12,
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
    // Mobile web (small screen < 640px): usar BottomTabBar
    if (showBottomTabBar) {
      return (
        <View style={{ flex: 1, width: "100%", backgroundColor: themeColors.background }}>
          <AppHeader />
          {tabs}
        </View>
      );
    }

    // Tablet web (medium screen 640px-1023px): usar drawer menu com hamburger
    if (showDrawerMenu) {
      return (
        <View style={{ flex: 1, width: "100%", backgroundColor: themeColors.background }}>
          {/* Header - full width */}
          <AppHeader
            menuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          />

          {/* Content area - centered with max-width constraint */}
          <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
            <View
              style={{
                flex: 1,
                width: "100%",
                maxWidth: 1200,
                flexDirection: "row",
                position: "relative",
              }}
            >
              {/* Mobile menu drawer - visível em telas menores (md a lg) */}
              <MobileMenuDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
              >
                <View
                  style={{
                    paddingTop: 20,
                    paddingBottom: 24,
                  }}
                >
                  <NavigationMenu onNavigate={() => setIsMenuOpen(false)} />
                </View>
              </MobileMenuDrawer>

              {/* Main content */}
              <View style={{ flex: 1, minWidth: 0 }}>{tabs}</View>
            </View>
          </View>
        </View>
      );
    }

    // Desktop web (large screen >= 1024px): usar sidebar permanente
    return (
      <View style={{ flex: 1, width: "100%", backgroundColor: themeColors.background }}>
        {/* Header - full width */}
        <AppHeader />

        {/* Content area - centered with max-width constraint */}
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 1200,
              flexDirection: "row",
              position: "relative",
            }}
          >
            {/* Sidebar - visível apenas em telas grandes (lg+) */}
            <WebSidebar />

            {/* Main content */}
            <View style={{ flex: 1, minWidth: 0 }}>{tabs}</View>
          </View>
        </View>
      </View>
    );
  }

  // Versão nativa (iOS/Android)
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      {tabs}
    </SafeAreaView>
  );
}
