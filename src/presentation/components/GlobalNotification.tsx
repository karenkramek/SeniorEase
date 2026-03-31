import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useNotification } from "@/presentation/contexts/NotificationContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

export function GlobalNotification() {
  const strings = useAppStrings().notifications;
  const { notification, clearNotification } = useNotification();
  const slideAnim = React.useRef(new Animated.Value(-120)).current;

  const { themeColors } = useTheme();

  const handleClose = React.useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      clearNotification();
    });
  }, [clearNotification, slideAnim]);

  useEffect(() => {
    if (!notification) {
      return;
    }

    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 55,
      friction: 7,
    }).start();

    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [handleClose, notification, slideAnim]);

  if (!notification) {
    return null;
  }

  const backgroundColor =
    notification.type === "success"
      ? themeColors.success
      : notification.type === "error"
        ? themeColors.error
        : themeColors.tint;

  const iconName =
    notification.type === "success"
      ? "checkmark-circle"
      : notification.type === "error"
        ? "alert-circle"
        : "information-circle";

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingTop: 52,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor,
        transform: [{ translateY: slideAnim }],
      }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      importantForAccessibility="yes"
      accessibilityLabel={notification.message}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons name={iconName} size={22} color={themeColors.buttonText} />
        <AccessibleText
          style={{ color: themeColors.buttonText, flex: 1, fontWeight: "600" }}
        >
          {notification.message}
        </AccessibleText>
        <TouchableOpacity
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel={strings.closeA11y}
          style={{ minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="close" size={20} color={themeColors.buttonText} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}