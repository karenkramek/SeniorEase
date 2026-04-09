import { usePreferences } from "@/presentation/hooks/usePreferences";
import { isWebPlatform, resolveThemeColors } from "@/presentation/theme/colors";

export function useTheme() {
  const { preferences } = usePreferences();
  const colorScheme = (preferences.theme ?? "light") as "light" | "dark";
  const isWeb = isWebPlatform();
  const themeColors = resolveThemeColors(
    preferences.theme,
    preferences.isHighContrast,
    isWeb,
  );

  return { themeColors, colorScheme, preferences, isWeb };
}
