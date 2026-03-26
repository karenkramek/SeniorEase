import { usePreferences } from "@/presentation/hooks/usePreferences";
import { Colors } from "@/presentation/theme/colors";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light,
): string {
  const { preferences } = usePreferences();
  const colorScheme = (preferences.theme ?? "light") as "light" | "dark";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme];
  return props[colorScheme] ?? themeColors[colorName];
}
