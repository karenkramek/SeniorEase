import { useTheme } from "@/presentation/hooks/useTheme";
import { isWebCompactViewport } from "@/presentation/theme/breakpoints";
import React from "react";
import {
  Modal,
  Platform,
  ScrollView,
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
  dialogLabel?: string;
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
  dialogLabel,
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
  const isCompactWeb = isWebCompactViewport(
    Platform.OS === "web",
    screenHeight,
  );
  const webDialogProps =
    Platform.OS === "web"
      ? ({
          role: "dialog",
          "aria-modal": "true",
          "aria-label": dialogLabel,
        } as const)
      : {};

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
          backgroundColor: modalBackdropColor,
          maxHeight: overlayMaxHeight,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: isCompactWeb ? "flex-start" : "center",
            alignItems: "center",
            paddingVertical: isCompactWeb ? 8 : 20,
            paddingHorizontal: 12,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            {...(webDialogProps as any)}
            style={{
              width: "100%",
              maxWidth,
              borderRadius: 12,
              padding: isCompactWeb ? 16 : 24,
              backgroundColor: themeColors.background,
              borderWidth: preferences.isHighContrast ? 2 : 1,
              borderColor: themeColors.icon,
              gap: 12,
              marginHorizontal: 20,
              maxHeight: Platform.OS === "web" ? screenHeight - 24 : undefined,
            }}
          >
            {header}
            {header && (
              <View
                style={{
                  height: 1,
                  backgroundColor: themeColors.icon + "30",
                  marginHorizontal: isCompactWeb ? -16 : -24,
                }}
              />
            )}
            {children}
            {footer}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
