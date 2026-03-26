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
}

export function AccessibleButton({
  title,
  icon,
  onPress,
  style,
  accessibilityLabel,
  accessibilityRole = "button",
  ...rest
}: AccessibleButtonProps & {
  accessibilityLabel?: string;
  accessibilityRole?: string;
}) {
  const { themeColors, preferences } = useTheme();

  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPress) {
      onPress(event);
    }
  };

  const buttonStyle = {
    backgroundColor: themeColors.tint,
    padding: Spacing.medium * preferences.spacingMultiplier,
    borderRadius: 40,
    alignItems: "center" as "center",
  };

  const textStyle = {
    color: themeColors.buttonText,
    fontWeight: "bold" as "bold",
  };

  return (
    <TouchableOpacity
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
}
