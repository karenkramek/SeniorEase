import { useTheme } from "@/presentation/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";

interface HamburgerMenuButtonProps {
  isOpen: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function HamburgerMenuButton({
  isOpen,
  onPress,
  accessibilityLabel,
}: HamburgerMenuButtonProps) {
  const { themeColors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || "Abrir menu"}
      accessibilityState={{ expanded: isOpen }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        padding: 8,
      })}
    >
      <Ionicons
        name={isOpen ? "close" : "menu"}
        size={28}
        color={themeColors.tint}
      />
    </Pressable>
  );
}
