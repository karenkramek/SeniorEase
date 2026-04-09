import { StyleSheet, Text, type TextProps } from "react-native";

import { useTheme } from "@/presentation/hooks/useTheme";
import { getUiFontFamily } from "@/presentation/theme/typography";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  accessibilityLabel,
  accessibilityRole,
  ...rest
}: ThemedTextProps & {
  accessibilityLabel?: string;
  accessibilityRole?: string;
}) {
  const { themeColors, colorScheme } = useTheme();
  const color =
    (colorScheme === "dark" ? darkColor : lightColor) ?? themeColors.text;
  const linkColor = themeColors.tint;
  const fontFamily = getUiFontFamily();

  return (
    <Text
      style={[
        { color },
        fontFamily ? { fontFamily } : undefined,
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "link"
          ? {
              color: linkColor,
              textDecorationLine: "underline",
            }
          : undefined,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
