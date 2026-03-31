import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileMenuDrawer({ isOpen, onClose, children }: MobileMenuDrawerProps) {
  const { themeColors } = useTheme();
  const animationRef = useRef(new Animated.Value(0)).current;

  // Animação de abertura/fechamento
  useEffect(() => {
    Animated.timing(animationRef, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, animationRef]);

  const translateX = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [-264, 0],
  });

  const overlayOpacity = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
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
              top: 0,
              bottom: 0,
              width: 264,
              backgroundColor: themeColors.background,
              transform: [{ translateX }],
              borderRightWidth: 1,
              borderRightColor: getColorWithOpacity(themeColors.icon, 0.35),
              zIndex: 50,
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
