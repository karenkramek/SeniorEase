import { useAppStrings } from "@/presentation/hooks/useAppStrings";
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
  const { navigation } = useAppStrings();

  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || navigation.menuOpenA11y}
      accessibilityState={{ expanded: isOpen }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        padding: 10,
        minWidth: 44,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
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
