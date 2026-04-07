import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useNotification } from "@/presentation/contexts/NotificationContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Animated, Platform, TouchableOpacity, View } from "react-native";

export function GlobalNotification() {
  const strings = useAppStrings().notifications;
  const { notification, clearNotification } = useNotification();
  const { themeColors, preferences, isWeb } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(-200)).current;

  const handleClose = React.useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -200,
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
      tension: 50,
      friction: 8,
    }).start();

    const duration = notification.duration ?? 4000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

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
        : notification.type === "warning"
          ? themeColors.warning
          : themeColors.tint;

  const iconName =
    notification.type === "success"
      ? "checkmark-circle-outline"
      : notification.type === "error"
        ? "alert-circle-outline"
        : notification.type === "warning"
          ? "alert-outline"
          : "information-circle-outline";

  const fontSize = 15 * (preferences.fontSizeMultiplier || 1);
  const descriptionFontSize = 13 * (preferences.fontSizeMultiplier || 1);
  const iconSize = isWeb ? 28 : 24;

  const a11yLabel = notification.description
    ? `${notification.type}: ${notification.message}. ${notification.description}`
    : `${notification.type}: ${notification.message}`;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingHorizontal: isWeb ? Spacing.large : Spacing.medium,
        paddingTop: Platform.OS === "web" ? Spacing.large : 52,
        paddingBottom: isWeb ? Spacing.medium : Spacing.small,
        backgroundColor: "transparent",
        transform: [{ translateY: slideAnim }],
      }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={a11yLabel}
      importantForAccessibility="yes"
    >
      {/* Container com limite de largura para web */}
      <View
        style={{
          marginHorizontal: "auto",
          maxWidth: isWeb ? 600 : "100%",
          width: "100%",
        }}
      >
        <View
          style={{
            backgroundColor,
            borderRadius: 8,
            paddingVertical: Spacing.medium,
            paddingHorizontal: Spacing.large,
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.medium,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {/* Ícone */}
          <View
            style={{
              minWidth: iconSize,
              minHeight: iconSize,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={iconName}
              size={iconSize}
              color={themeColors.buttonText}
              accessibilityElementsHidden
            />
          </View>

          {/* Conteúdo (Mensagem + Descrição) */}
          <View style={{ flex: 1, gap: 4 }}>
            <AccessibleText
              style={{
                color: themeColors.buttonText,
                fontWeight: "600",
                fontSize,
                lineHeight: fontSize * 1.4,
              }}
            >
              {notification.message}
            </AccessibleText>
            {notification.description && (
              <AccessibleText
                style={{
                  color: themeColors.buttonText,
                  opacity: 0.92,
                  fontSize: descriptionFontSize,
                  lineHeight: descriptionFontSize * 1.35,
                }}
              >
                {notification.description}
              </AccessibleText>
            )}
          </View>

          {/* Botão Fechar */}
          <TouchableOpacity
            onPress={handleClose}
            accessible
            accessibilityRole="button"
            accessibilityLabel={strings.closeA11y}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            style={{
              marginTop: 2,
              minHeight: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="close"
              size={22}
              color={themeColors.buttonText}
              accessibilityElementsHidden
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
