import { Ionicons } from "@expo/vector-icons";

export const NAVIGATION_ICONS = {
  TaskListScreen: {
    focused: "checkmark-circle",
    unfocused: "checkmark-circle-outline",
  },
  PreferencesScreen: {
    focused: "settings",
    unfocused: "settings-outline",
  },
  HelpScreen: {
    focused: "help-circle",
    unfocused: "help-circle-outline",
  },
} as const;

export type NavigationScreen = keyof typeof NAVIGATION_ICONS;

export function getNavigationIcon(
  screen: NavigationScreen,
  focused: boolean,
): keyof typeof Ionicons.glyphMap {
  const icons = NAVIGATION_ICONS[screen];
  return icons
    ? focused
      ? icons.focused
      : icons.unfocused
    : "help-circle-outline";
}
