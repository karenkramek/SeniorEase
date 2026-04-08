import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import * as Haptics from "expo-haptics";
import React from "react";
import {
    GestureResponderEvent,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from "react-native";

interface AccessibleButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: React.ReactNode;
  textColor?: string;
  variant?: "primary" | "secondary" | "destructive";
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
    textColor,
    variant = "primary",
    accessibilityLabel,
    accessibilityRole = "button",
    ...rest
  },
  ref,
) {
  const { themeColors, preferences } = useTheme();

  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPress) {
      onPress(event);
    }
  };

  // Determine button colors based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          backgroundColor: themeColors.error,
          textColor: themeColors.buttonText,
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          textColor: themeColors.text,
          borderWidth: 1,
          borderColor: themeColors.icon,
        };
      case "primary":
      default:
        return {
          backgroundColor: themeColors.tint,
          textColor: themeColors.buttonText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const buttonStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderWidth: variantStyles.borderWidth ?? 0,
    borderColor: variantStyles.borderColor ?? "transparent",
    paddingVertical: Spacing.medium * preferences.spacingMultiplier,
    paddingHorizontal: Spacing.large * preferences.spacingMultiplier,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: 48,
  };

  const textStyle = {
    color: textColor || variantStyles.textColor,
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
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
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
