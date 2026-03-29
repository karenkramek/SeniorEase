import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import {
  isWebPlatform,
  resolveThemeColors,
} from "@/presentation/theme/colors";

/**
 * Hook centralizado para resolução do tema.
 * Elimina a repetição do padrão de 3 linhas em componentes e telas.
 */
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
