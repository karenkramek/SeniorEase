import { usePreferences } from "@/presentation/hooks/usePreferences";
import { Colors } from "@/presentation/theme/colors";
import { useColorScheme } from "react-native";

type ThemeColorName = keyof typeof Colors.light;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName,
): string {
  const { preferences } = usePreferences();
  const systemScheme = useColorScheme() ?? "light";

  if (preferences.isHighContrast) {
    return Colors.highContrast[colorName];
  }

  const colorScheme = (preferences.theme ?? systemScheme) as "light" | "dark";
  return props[colorScheme] ?? Colors[colorScheme][colorName];
}
