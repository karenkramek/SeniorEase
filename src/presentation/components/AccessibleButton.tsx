import { AccessibleText } from "@/presentation/components/AccessibleText";
import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import { Colors } from "@/presentation/theme/colors";
import { Spacing } from "@/presentation/theme/spacing";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from "react-native";


interface AccessibleButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: React.ReactNode;
}

export const AccessibleButton = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  AccessibleButtonProps & {
    accessibilityLabel?: string;
    accessibilityRole?: string;
  }
>(function AccessibleButton(
  {
    title,
    icon,
    onPress,
    style,
    accessibilityLabel,
    accessibilityRole = "button",
    ...rest
  },
  ref,
) {
  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPress) {
      if (preferences.useExtraConfirmation) {
        // A real implementation would show a confirmation modal here.
        console.log("Triggering confirmation logic...");
      }
      onPress(event);
    }
  };

  const buttonStyle = {
    backgroundColor: themeColors.tint,
    padding: Spacing.medium * preferences.spacingMultiplier,
    borderRadius: Spacing.small,
    alignItems: "center" as "center",
  };

  const textStyle = {
    color: themeColors.buttonText,
    fontWeight: "bold" as "bold",
  };

  return (
    <TouchableOpacity
      ref={ref}
      onPress={handlePress}
      style={[buttonStyle, style]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={accessibilityRole}
      {...rest}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && <View style={{ marginRight: 12 }}>{icon}</View>}
        <AccessibleText
          style={textStyle}
          accessibilityLabel={accessibilityLabel || title}
        >
          {title}
        </AccessibleText>
      </View>
    </TouchableOpacity>
  );
});
