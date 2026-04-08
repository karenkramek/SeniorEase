import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { BaseModal } from "@/presentation/components/BaseModal";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  restoreFocusRef?: React.RefObject<React.ElementRef<
    typeof TouchableOpacity
  > | null>;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false,
  restoreFocusRef,
}: ConfirmModalProps) {
  const { themeColors } = useTheme();
  const { common } = useAppStrings();
  const effectiveConfirmText = confirmText ?? common.confirm;
  const effectiveCancelText = cancelText ?? common.cancel;

  const confirmButtonRef = React.useRef<React.ElementRef<
    typeof TouchableOpacity
  > | null>(null);

  return (
    <BaseModal
      visible={visible}
      onClose={onCancel}
      restoreFocusRef={restoreFocusRef}
      maxWidth={420}
      onShow={() => {
        if (Platform.OS === "web") {
          setTimeout(() => {
            confirmButtonRef.current?.focus?.();
          }, 0);
        }
      }}
    >
      <AccessibleText type="h2" accessibilityLabel={title}>
        {title}
      </AccessibleText>
      <AccessibleText accessibilityLabel={message}>
        {message}
      </AccessibleText>

      <View style={{ marginTop: 12, gap: 12, flexDirection: "row", justifyContent: "center" }}>
        <AccessibleButton
          title={effectiveCancelText}
          onPress={onCancel}
          accessibilityLabel={effectiveCancelText}
          textColor={themeColors.text}
          style={[
            sharedStyles.secondaryButton,
            {
              flex: 1,
              backgroundColor: "transparent",
              borderColor: themeColors.icon,
            },
          ]}
        />
        <AccessibleButton
          ref={confirmButtonRef}
          title={effectiveConfirmText}
          onPress={onConfirm}
          accessibilityLabel={effectiveConfirmText}
          style={{
            flex: 1,
            backgroundColor: isDestructive ? themeColors.error : themeColors.tint,
          }}
        />
      </View>
    </BaseModal>
  );
}
