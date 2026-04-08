import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import { useMemo } from "react";

/**
 * Hook que retorna a altura do botão baseada na configuração de font size multiplier
 * Normal: 56px
 * Com fonte grande: 64px
 */
export const useButtonHeight = () => {
  const { preferences } = usePreferences();

  return useMemo(() => {
    return preferences.fontSizeMultiplier > 1 ? 64 : 56;
  }, [preferences.fontSizeMultiplier]);
};
