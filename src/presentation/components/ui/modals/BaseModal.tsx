import { useTheme } from "@/presentation/hooks/useTheme";
import React from "react";
import {
    Modal,
    Platform,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
  onShow?: () => void;
  restoreFocusRef?: React.RefObject<React.ElementRef<
    typeof TouchableOpacity
  > | null>;
}

export function BaseModal({
  visible,
  onClose,
  children,
  header,
  footer,
  maxWidth = 520,
  onShow,
  restoreFocusRef,
}: BaseModalProps) {
  const { themeColors, colorScheme, preferences } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const wasVisibleRef = React.useRef(false);

  const modalBackdropColor = preferences.isHighContrast
    ? "rgba(255,255,255,0.30)"
    : colorScheme === "dark"
      ? "rgba(0,0,0,0.72)"
      : "rgba(0,0,0,0.45)";

  React.useEffect(() => {
    if (visible) {
      wasVisibleRef.current = true;
      return;
    }

    if (Platform.OS === "web" && wasVisibleRef.current) {
      const timer = setTimeout(() => {
        restoreFocusRef?.current?.focus?.();
      }, 0);
      wasVisibleRef.current = false;
      return () => clearTimeout(timer);
    }
  }, [restoreFocusRef, visible]);

  // No mobile APP, deixa espaço para o menu inferior (insets.bottom) + 20px extra
  const isMobileApp = Platform.OS !== "web";
  const overlayMaxHeight = isMobileApp
    ? screenHeight - insets.bottom - 20
    : screenHeight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
      onShow={onShow}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: modalBackdropColor,
          maxHeight: overlayMaxHeight,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth,
            borderRadius: 12,
            padding: 24,
            backgroundColor: themeColors.background,
            borderWidth: preferences.isHighContrast ? 2 : 1,
            borderColor: themeColors.icon,
            gap: 12,
            marginHorizontal: 20,
          }}
        >
          {header}
          {header && (
            <View
              style={{
                height: 1,
                backgroundColor: themeColors.icon + "30",
                marginHorizontal: -24,
              }}
            />
          )}
          {children}
          {footer}
        </View>
      </View>
    </Modal>
  );
}
