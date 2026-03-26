import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import { Colors } from "@/presentation/theme/colors";

/**
 * Hook centralizado para resolução do tema.
 * Elimina a repetição do padrão de 3 linhas em componentes e telas.
 */
export function useTheme() {
  const { preferences } = usePreferences();
  const colorScheme = (preferences.theme ?? "light") as "light" | "dark";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme];

  return { themeColors, colorScheme, preferences };
}
