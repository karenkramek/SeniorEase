import { View, type ViewProps } from "react-native";

import { useTheme } from "@/presentation/hooks/useTheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  accessibilityLabel,
  accessibilityRole,
  ...otherProps
}: ThemedViewProps & {
  accessibilityLabel?: string;
  accessibilityRole?: string;
}) {
  const { themeColors, colorScheme } = useTheme();
  const backgroundColor =
    (colorScheme === "dark" ? darkColor : lightColor) ?? themeColors.background;
  return (
    <View
      style={[{ backgroundColor }, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...otherProps}
    />
  );
}
