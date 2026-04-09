import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DrawerDirection = "left" | "top";

interface AnimatedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  direction: DrawerDirection;
  contentStyle?: ViewStyle;
}

export function AnimatedDrawer({
  isOpen,
  onClose,
  children,
  direction,
  contentStyle,
}: AnimatedDrawerProps) {
  const { themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const animationRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationRef, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, animationRef]);

  const transform =
    direction === "left"
      ? [
          {
            translateX: animationRef.interpolate({
              inputRange: [0, 1],
              outputRange: [-264, 0],
            }),
          },
        ]
      : [
          {
            translateY: animationRef.interpolate({
              inputRange: [0, 1],
              outputRange: [-300, 0],
            }),
          },
        ];

  const overlayOpacity = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, direction === "left" ? 1 : 0.5],
  });

  const defaultContentStyle: ViewStyle =
    direction === "left"
      ? {
          position: "absolute",
          left: 0,
          top: insets.top,
          bottom: 0,
          width: 264,
          backgroundColor: themeColors.background,
          borderRightWidth: 1,
          borderRightColor: getColorWithOpacity(themeColors.icon, 0.35),
          zIndex: 50,
        }
      : {
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          backgroundColor: themeColors.background,
          borderBottomWidth: 1,
          borderBottomColor: getColorWithOpacity(themeColors.icon, 0.35),
          zIndex: 50,
        };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: getColorWithOpacity(themeColors.text, 0.5),
            zIndex: 40,
            opacity: overlayOpacity,
          },
        ]}
        pointerEvents="auto"
      >
        <Pressable
          onPress={onClose}
          style={{ flex: 1 }}
          testID="drawer-overlay"
        />
      </Animated.View>

      {/* Drawer container */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { zIndex: 50, pointerEvents: "auto" }]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[defaultContentStyle, { transform }, contentStyle]}
          pointerEvents="auto"
        >
          {children}
        </Animated.View>
      </Animated.View>
    </>
  );
}
