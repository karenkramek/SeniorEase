import { useTheme } from "@/presentation/hooks/useTheme";
import { Text, TextProps } from "react-native";

import {
  getUiFontFamily,
  Typography,
} from "@/presentation/theme/typography";

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
  const { themeColors, preferences } = useTheme();

  const fontFamily = getUiFontFamily();
  const textStyle = {
    color: themeColors.text,
    fontSize: Typography[type].fontSize * preferences.fontSizeMultiplier,
    lineHeight: (Typography[type].lineHeight ?? Typography[type].fontSize * 1.5)
      * preferences.fontSizeMultiplier,
    fontWeight: (Typography[type] as { fontWeight?: "bold" | "600" }).fontWeight,
    ...(fontFamily ? { fontFamily } : {}),
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
