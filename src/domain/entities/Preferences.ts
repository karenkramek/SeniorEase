export interface Preferences {
  fontSizeMultiplier: number;
  isHighContrast: boolean;
  spacingMultiplier: number;
  isSimplifiedMode: boolean;
  useExtraConfirmation: boolean;
  theme?: "light" | "dark";
  confirmOnComplete?: boolean;
}
