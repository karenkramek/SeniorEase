import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import { Spacing } from "@/presentation/theme/spacing";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function HomeMenuDrawer({ isOpen, onClose, children }: HomeMenuDrawerProps) {
  const { themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const animationRef = useRef(new Animated.Value(0)).current;

  // Animação de abertura/fechamento
  useEffect(() => {
    Animated.timing(animationRef, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, animationRef]);

  const translateY = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const overlayOpacity = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <>
      {/* Overlay de fundo */}
      {isOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: getColorWithOpacity(themeColors.text, 0.5),
              zIndex: 40,
              opacity: overlayOpacity,
            },
          ]}
          pointerEvents={isOpen ? "auto" : "none"}
        >
          <Pressable
            onPress={onClose}
            style={{ flex: 1 }}
            testID="drawer-overlay"
          />
        </Animated.View>
      )}

      {/* Drawer container com animação */}
      {isOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 50,
              pointerEvents: "auto",
            },
          ]}
          pointerEvents="box-none"
        >
          {/* Drawer content */}
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: insets.top + Spacing.medium + Spacing.medium + Spacing.large + 40,
              backgroundColor: themeColors.background,
              transform: [{ translateY }],
              borderBottomWidth: 1,
              borderBottomColor: getColorWithOpacity(themeColors.icon, 0.35),
              zIndex: 50,
              paddingHorizontal: Spacing.large,
              paddingTop: Spacing.large,
              paddingBottom: Spacing.large,
              gap: Spacing.medium,
              flexDirection: "column",
            }}
            pointerEvents="auto"
          >
            {children}
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
}
