import { authStyles } from "@/presentation/components/auth/AuthLayout";
import { AccessibleFormField } from "@/presentation/components/shared/AccessibleFormField";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordFieldProps {
  fieldId: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error?: string;
  editable?: boolean;
  returnKeyType?: "done" | "go" | "next";
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const PasswordField = forwardRef<TextInput, PasswordFieldProps>(
  (
    {
      fieldId,
      accessibilityLabel,
      accessibilityHint,
      placeholder,
      value,
      onChangeText,
      onBlur,
      error,
      editable = true,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
      iconName = "lock-closed-outline",
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const { themeColors } = useTheme();
    const commonStrings = useAppStrings().common;

    return (
      <View style={authStyles.passwordFieldWrapper}>
        <AccessibleFormField
          ref={ref}
          fieldId={fieldId}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          required
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          error={error}
          iconComponent={
            <Ionicons name={iconName} size={20} color={themeColors.icon} />
          }
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={[authStyles.eyeIcon, { top: Platform.OS === "web" ? 2 : 5 }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            showPassword
              ? commonStrings.hidePasswordA11y
              : commonStrings.showPasswordA11y
          }
          accessibilityHint={commonStrings.togglePasswordHint}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={themeColors.icon}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

PasswordField.displayName = "PasswordField";
