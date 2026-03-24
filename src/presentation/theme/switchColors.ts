import { Colors } from "@/presentation/theme/colors";

type ThemeColors = (typeof Colors)["light"];

export function getSwitchColors(themeColors: ThemeColors, value: boolean) {
  return {
    thumbColor: value ? themeColors.switchThumbOn : themeColors.switchThumbOff,
    iosBackgroundColor: themeColors.switchTrackOff,
    trackColor: {
      false: themeColors.switchTrackOff,
      true: themeColors.switchTrackOn,
    },
  };
}
