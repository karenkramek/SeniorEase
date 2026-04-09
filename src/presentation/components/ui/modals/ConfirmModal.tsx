import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { BaseModal } from "@/presentation/components/ui/modals/BaseModal";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useButtonHeight } from "@/presentation/hooks/useButtonHeight";
import { useTheme } from "@/presentation/hooks/useTheme";
import { isWebPlatform } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import React from "react";
import {
    Platform,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

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
  const { width: screenWidth } = useWindowDimensions();
  const buttonHeight = useButtonHeight();
  const effectiveConfirmText = confirmText ?? common.confirm;
  const effectiveCancelText = cancelText ?? common.cancel;

  const isWeb = isWebPlatform();
  const isSmallScreen = screenWidth < 640;
  const shouldStackButtons = !isWeb || (isWeb && isSmallScreen);

  const confirmButtonRef = React.useRef<React.ElementRef<
    typeof TouchableOpacity
  > | null>(null);

  return (
    <BaseModal
      visible={visible}
      onClose={onCancel}
      restoreFocusRef={restoreFocusRef}
      maxWidth={450}
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
      <AccessibleText accessibilityLabel={message}>{message}</AccessibleText>

      <View
        style={{
          marginTop: 12,
          gap: 12,
          flexDirection: shouldStackButtons ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginHorizontal: "auto",
        }}
      >
        <AccessibleButton
          ref={confirmButtonRef}
          title={effectiveConfirmText}
          onPress={onConfirm}
          accessibilityLabel={effectiveConfirmText}
          textColor={themeColors.buttonText}
          style={[
            sharedStyles.secondaryButton,
            {
              height: buttonHeight,
              backgroundColor: isDestructive
                ? themeColors.error
                : themeColors.tint,
              borderWidth: 0,
              borderColor: "transparent",
              minWidth: 200,
              maxWidth: 230,
            },
          ]}
        />
        <AccessibleButton
          title={effectiveCancelText}
          onPress={onCancel}
          accessibilityLabel={effectiveCancelText}
          textColor={themeColors.text}
          style={[
            sharedStyles.secondaryButton,
            {
              height: buttonHeight,
              backgroundColor: "transparent",
              borderColor: themeColors.icon,
              minWidth: 200,
              maxWidth: 230,
            },
          ]}
        />
      </View>
    </BaseModal>
  );
}
