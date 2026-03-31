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

interface NavigationMenuProps {
  onNavigate?: () => void; // Callback para fechar menu ao navegar (mobile)
}

export function NavigationMenu({ onNavigate }: NavigationMenuProps) {
  const router = useRouter();
  const segments = useSegments();
  const appTexts = useAppStrings();
  const nav = appTexts.navigation;
  const { themeColors } = useTheme();
  const active = getActiveTabSegment(segments as string[]);
  const webFont = getUiFontFamily();

  const handleNavigation = (href: Href) => {
    router.push(href);
    onNavigate?.();
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 6, opacity: 1 }}
    >
      {TAB_ITEMS.map((item) => {
        const isActive = active === item.segment;
        const label = nav[item.titleKey];
        const a11y = nav[item.a11yKey];
        return (
          <Pressable
            key={item.segment}
            onPress={() => handleNavigation(item.href)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel={a11y}
            accessibilityState={{ selected: isActive }}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: isActive
                ? getColorWithOpacity(themeColors.tint, 0.1)
                : pressed
                  ? getColorWithOpacity(themeColors.tint, 0.05)
                  : "transparent",
            })}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons
                name={getNavigationIcon(item.iconKey, isActive)}
                size={24}
                color={isActive ? themeColors.tint : themeColors.icon}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: webFont,
                  color: isActive ? themeColors.tint : themeColors.text,
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
