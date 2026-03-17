import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import { Text, TextProps } from "react-native";

import { Colors } from "@/presentation/theme/colors";
import { Typography } from "@/presentation/theme/typography";

type AccessibleTextProps = TextProps & {
  type?: keyof typeof Typography;
};

export function AccessibleText({
  style,
  type = "body",
  accessibilityLabel,
  accessibilityRole,
  ...rest
}: AccessibleTextProps & {
  accessibilityLabel?: string;
  accessibilityRole?: string;
}) {
  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  const textStyle = {
    color: themeColors.text,
    fontSize: Typography[type].fontSize * preferences.fontSizeMultiplier,
    fontWeight: (Typography[type] as any).fontWeight
      ? ((Typography[type] as any).fontWeight as "bold" | "normal" | undefined)
      : undefined,
  };

  return (
    <Text
      style={[textStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...rest}
    />
  );
}
