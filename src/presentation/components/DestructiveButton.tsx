import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import React from "react";
import { TouchableOpacity } from "react-native";

/**
 * DestructiveButton Component
 *
 * A specialized button for destructive actions (delete, remove, etc.).
 * Provides consistent styling across the application for dangerous actions.
 *
 * Features:
 * - Uses error color from theme (red tones that are accessible and age-friendly)
 * - Automatically adjusts color for dark mode, light mode, and high contrast
 * - Includes visual indicators (background + border) for clarity
 * - Optimized for elderly users with larger touch targets
 *
 * Accessibility:
 * - WCAG AA compliant contrast ratios
 * - Proper haptic feedback on press
 * - Clear accessibility labels and hints
 */

interface DestructiveButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
}

export const DestructiveButton = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  DestructiveButtonProps
>(function DestructiveButton(
  {
    title,
    onPress,
    accessibilityLabel,
    accessibilityHint,
    disabled,
  },
  ref,
) {
  return (
    <AccessibleButton
      ref={ref}
      title={title}
      onPress={onPress}
      variant="destructive"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
    />
  );
});

export default DestructiveButton;
