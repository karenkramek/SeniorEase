import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/presentation/hooks/useThemeColor";

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
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  return (
    <View
      style={[{ backgroundColor }, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...otherProps}
    />
  );
}
