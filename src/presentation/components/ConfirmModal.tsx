import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTheme } from "@/presentation/hooks/useTheme";
import React from "react";
import { Modal, Platform, TouchableOpacity, View } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  restoreFocusRef?: React.RefObject<
    React.ElementRef<typeof TouchableOpacity> | null
  >;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  restoreFocusRef,
}: ConfirmModalProps) {
  const { themeColors } = useTheme();
  const effectiveConfirmText = confirmText ?? "Confirmar";
  const effectiveCancelText = cancelText ?? "Cancelar";

  const confirmButtonRef =
    React.useRef<React.ElementRef<typeof TouchableOpacity> | null>(null);
  const wasVisibleRef = React.useRef(false);

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
      onShow={() => {
        if (Platform.OS === "web") {
          setTimeout(() => {
            confirmButtonRef.current?.focus?.();
          }, 0);
        }
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 12,
            padding: 24,
            backgroundColor: themeColors.background,
            borderWidth: 1,
            borderColor: themeColors.icon,
            gap: 12,
          }}
        >
          <AccessibleText type="h2" accessibilityLabel={title}>
            {title}
          </AccessibleText>
          <AccessibleText accessibilityLabel={message}>{message}</AccessibleText>

          <View style={{ marginTop: 8, gap: 8 }}>
            <AccessibleButton
              ref={confirmButtonRef}
              title={effectiveConfirmText}
              onPress={onConfirm}
              accessibilityLabel={effectiveConfirmText}
            />
            <AccessibleButton
              title={effectiveCancelText}
              onPress={onCancel}
              accessibilityLabel={effectiveCancelText}
              style={{ backgroundColor: themeColors.icon }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
