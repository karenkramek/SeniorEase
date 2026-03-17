import { useColorScheme } from "@/presentation/hooks/useColorScheme";
import { usePreferences } from "@/presentation/hooks/usePreferences";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string,
): string {
  const { preferences } = usePreferences();
  const systemScheme = useColorScheme() ?? "light";
  const colorScheme = preferences.theme ?? "light";
  return props[colorScheme] || colorName;
}
