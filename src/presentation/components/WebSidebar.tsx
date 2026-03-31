import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import React from "react";
import { View } from "react-native";
import { NavigationMenu } from "./NavigationMenu";

export function WebSidebar() {
  const { themeColors } = useTheme();
  const appTexts = useAppStrings();
  const nav = appTexts.navigation;

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
      <NavigationMenu />
    </View>
  );
}
