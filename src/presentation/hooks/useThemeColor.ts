import { usePreferences } from "@/presentation/hooks/usePreferences";
import {
  isWebPlatform,
  resolveThemeColors,
  type ThemeColorName,
} from "@/presentation/theme/colors";
import { useColorScheme } from "react-native";

export type { ThemeColorName };

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName,
): string {
  const { preferences } = usePreferences();
  const systemScheme = useColorScheme() ?? "light";

  if (preferences.isHighContrast) {
    return resolveThemeColors(
      preferences.theme,
      true,
      isWebPlatform(),
    )[colorName];
  }

  const colorScheme = (preferences.theme ?? systemScheme) as "light" | "dark";
  const palette = resolveThemeColors(
    colorScheme,
    false,
    isWebPlatform(),
  );
  return props[colorScheme] ?? palette[colorName];
}
