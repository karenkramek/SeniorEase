import { Appearance } from "react-native";

export function useColorScheme(): "light" | "dark" {
  // Garante apenas valores válidos
  const scheme = Appearance.getColorScheme();
  return scheme === "dark" ? "dark" : "light";
}
