import React from "react";
import { Modal, View } from "react-native";

import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { themeColors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <View style={sharedStyles.modalOverlay}>
        <View
          style={[
            sharedStyles.modalCard,
            { backgroundColor: themeColors.background },
          ]}
        >
          <AccessibleText
            style={{ fontSize: 18, marginBottom: 16, textAlign: "center" }}
            accessibilityLabel={message}
          >
            {message}
          </AccessibleText>
          <AccessibleButton
            title={confirmLabel}
            onPress={onConfirm}
            style={{ marginBottom: 8, width: "100%" }}
            accessibilityLabel={confirmLabel}
          />
          <AccessibleButton
            title={cancelLabel}
            onPress={onCancel}
            style={{ width: "100%" }}
            accessibilityLabel={cancelLabel}
          />
        </View>
      </View>
    </Modal>
  );
}
