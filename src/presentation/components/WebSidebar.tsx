import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import { getUiFontFamily } from "@/presentation/theme/typography";
import { getNavigationIcon } from "@/presentation/utils/icons";
import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const TAB_SEGMENTS = ["tasks", "preferences", "help", "profile"] as const;
type TabSegment = (typeof TAB_SEGMENTS)[number];

const TAB_ITEMS: {
  segment: TabSegment;
  href: Href;
  titleKey: "tasksTabTitle" | "preferencesTabTitle" | "helpTabTitle" | "profileTabTitle";
  a11yKey:
    | "tasksTabA11y"
    | "preferencesTabA11y"
    | "helpTabA11y"
    | "profileTabA11y";
  iconKey: "tasks" | "preferences" | "help" | "profile";
}[] = [
  {
    segment: "tasks",
    href: "/(app)/(tabs)/tasks",
    titleKey: "tasksTabTitle",
    a11yKey: "tasksTabA11y",
    iconKey: "tasks",
  },
  {
    segment: "preferences",
    href: "/(app)/(tabs)/preferences",
    titleKey: "preferencesTabTitle",
    a11yKey: "preferencesTabA11y",
    iconKey: "preferences",
  },
  {
    segment: "help",
    href: "/(app)/(tabs)/help",
    titleKey: "helpTabTitle",
    a11yKey: "helpTabA11y",
    iconKey: "help",
  },
  {
    segment: "profile",
    href: "/(app)/(tabs)/profile",
    titleKey: "profileTabTitle",
    a11yKey: "profileTabA11y",
    iconKey: "profile",
  },
];

function getActiveTabSegment(segments: string[]): TabSegment | null {
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (TAB_SEGMENTS.includes(s as TabSegment)) {
      return s as TabSegment;
    }
  }
  return null;
}

export function WebSidebar() {
  const router = useRouter();
  const segments = useSegments();
  const appTexts = useAppStrings();
  const nav = appTexts.navigation;
  const { themeColors } = useTheme();
  const active = getActiveTabSegment(segments as string[]);
  const webFont = getUiFontFamily();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={nav.mainNavigationA11y}
      style={{
        width: 264,
        flexShrink: 0,
        alignSelf: "stretch",
        backgroundColor: themeColors.background,
        borderRightWidth: 1,
        borderRightColor: getColorWithOpacity(themeColors.icon, 0.35),
        paddingTop: 20,
        paddingBottom: 24,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}
      >
        {TAB_ITEMS.map((item) => {
          const isActive = active === item.segment;
          const label = nav[item.titleKey];
          const a11y = nav[item.a11yKey];
          return (
            <Pressable
              key={item.segment}
              onPress={() => router.push(item.href)}
              accessibilityRole="tab"
              accessibilityLabel={a11y}
              accessibilityState={{ selected: isActive }}
              style={({ hovered }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                minHeight: 52,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderLeftWidth: isActive ? 4 : 0,
                borderLeftColor: isActive ? themeColors.tint : "transparent",
                backgroundColor: isActive
                  ? getColorWithOpacity(themeColors.tint, 0.14)
                  : hovered
                    ? getColorWithOpacity(themeColors.tint, 0.06)
                    : "transparent",
              })}
            >
              <Ionicons
                name={getNavigationIcon(item.iconKey, isActive)}
                size={26}
                color={isActive ? themeColors.tint : themeColors.tabIconDefault}
                accessibilityElementsHidden
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? themeColors.text : themeColors.tabIconDefault,
                  ...(webFont ? { fontFamily: webFont } : {}),
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
