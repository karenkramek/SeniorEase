import { TaskStatus } from "@/domain/enums/TaskStatus";
import { Platform } from "react-native";

/**
 * Paletas por superfície:
 * - native: tons quentes + teal (tom acolhedor, foco em polegar e telas pequenas).
 * - web: slate + índigo (visual mais “painel”, leitura em telas largas).
 * Alto contraste permanece idêntico nas duas superfícies (WCAG / preferências médicas).
 */
export type ThemePalette = {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  success: string;
  error: string;
  warning: string;
  buttonText: string;
  switchTrackOff: string;
  switchTrackOn: string;
  switchThumbOff: string;
  switchThumbOn: string;
};

const nativeLight: ThemePalette = {
  text: "#1C1917",
  background: "#F5F0E8",
  tint: "#0F766E",
  icon: "#115E59",
  tabIconDefault: "#78716C",
  tabIconSelected: "#0F766E",
  success: "#047857",
  error: "#B91C1C",
  warning: "#C2410C",
  buttonText: "#FFFFFF",
  switchTrackOff: "#A8A29E",
  switchTrackOn: "#0F766E",
  switchThumbOff: "#FFFFFF",
  switchThumbOn: "#FFFFFF",
};

const nativeDark: ThemePalette = {
  text: "#FAFAF9",
  background: "#1C1917",
  tint: "#5EEAD4",
  icon: "#99F6E4",
  tabIconDefault: "#A8A29E",
  tabIconSelected: "#5EEAD4",
  success: "#4ADE80",
  error: "#FCA5A5",
  warning: "#FDBA74",
  buttonText: "#0C1A18",
  switchTrackOff: "#57534E",
  switchTrackOn: "#2DD4BF",
  switchThumbOff: "#FAFAF9",
  switchThumbOn: "#0C1A18",
};

const webLight: ThemePalette = {
  text: "#0F172A",
  background: "#F1F5F9",
  tint: "#4338CA",
  icon: "#4F46E5",
  tabIconDefault: "#64748B",
  tabIconSelected: "#4338CA",
  success: "#047857",
  error: "#B91C1C",
  warning: "#B45309",
  buttonText: "#FFFFFF",
  switchTrackOff: "#94A3B8",
  switchTrackOn: "#4338CA",
  switchThumbOff: "#FFFFFF",
  switchThumbOn: "#FFFFFF",
};

const webDark: ThemePalette = {
  text: "#F8FAFC",
  background: "#0F172A",
  tint: "#A5B4FC",
  icon: "#C7D2FE",
  tabIconDefault: "#94A3B8",
  tabIconSelected: "#A5B4FC",
  success: "#34D399",
  error: "#FCA5A5",
  warning: "#FCD34D",
  buttonText: "#0F172A",
  switchTrackOff: "#475569",
  switchTrackOn: "#818CF8",
  switchThumbOff: "#F8FAFC",
  switchThumbOn: "#0F172A",
};

export const themeSurfaces = {
  native: { light: nativeLight, dark: nativeDark },
  web: { light: webLight, dark: webDark },
} as const;

export const Colors = {
  highContrast: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#FFD400",
    icon: "#FFFFFF",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: "#FFD400",
    success: "#00FF00",
    error: "#FF0000",
    warning: "#FFD400",
    buttonText: "#000000",
    switchTrackOff: "#666666",
    switchTrackOn: "#FFD400",
    switchThumbOff: "#FFFFFF",
    switchThumbOn: "#000000",
  } satisfies ThemePalette,
};

export type ThemeColorName = keyof ThemePalette;

export function isWebPlatform(): boolean {
  return Platform.OS === "web";
}

export function resolveThemeColors(
  theme: "light" | "dark" | undefined,
  isHighContrast: boolean,
  isWeb: boolean,
): ThemePalette {
  if (isHighContrast) {
    return Colors.highContrast;
  }
  const scheme = (theme ?? "light") as "light" | "dark";
  const surface = isWeb ? themeSurfaces.web : themeSurfaces.native;
  return surface[scheme];
}

/** Cores de status em listas / ajuda: nativo mais quente, web mais “dashboard”. */
export const TaskStatusColorsNative: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "#EA580C",
  [TaskStatus.COMPLETED]: "#059669",
};

export const TaskStatusColorsWeb: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "#D97706",
  [TaskStatus.COMPLETED]: "#10B981",
};

export const TaskStatusColors: Record<TaskStatus, string> =
  Platform.OS === "web" ? TaskStatusColorsWeb : TaskStatusColorsNative;

export function getTaskStatusColor(status: TaskStatus): string {
  const map =
    Platform.OS === "web" ? TaskStatusColorsWeb : TaskStatusColorsNative;
  return map[status] || "#95a5a6";
}

export function getColorWithOpacity(color: string, opacity: number): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
