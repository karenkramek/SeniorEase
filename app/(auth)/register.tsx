import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { z } from "zod";

import {
  AuthLayout,
  authStyles,
} from "@/presentation/components/auth/AuthLayout";
import { PasswordField } from "@/presentation/components/auth/PasswordField";
import { AccessibleFormField } from "@/presentation/components/shared/AccessibleFormField";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/hooks/useTheme";
import { showAlert } from "@/presentation/utils/alert";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.authRegister;
  const commonStrings = appTexts.common;
  const { signUp } = useAuth();
  const { themeColors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const registerSchema = React.useMemo(
    () =>
      z
        .object({
          name: z
            .string()
            .min(3, strings.nameMinError)
            .refine(
              (val) => val.trim().split(/\s+/).filter(Boolean).length >= 2,
              strings.nameFullError,
            ),
          email: z.string().email(commonStrings.emailInvalidError),
          password: z.string().min(6, commonStrings.passwordMinError),
          confirmPassword: z
            .string()
            .min(6, strings.confirmPasswordRequiredError),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: strings.passwordMismatchError,
          path: ["confirmPassword"],
        }),
    [
      strings.nameMinError,
      strings.nameFullError,
      commonStrings.emailInvalidError,
      commonStrings.passwordMinError,
      strings.confirmPasswordRequiredError,
      strings.passwordMismatchError,
    ],
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.name);
      showAlert(strings.successTitle, strings.successBody, [
        {
          text: commonStrings.ok,
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (error: any) {
      if (error.message === strings.emailAlreadyInUseError) {
        setError("email", { message: strings.emailAlreadyInUseError });
      } else {
        showAlert(strings.registerErrorTitle, error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      formTitle={strings.formTitle}
      footerLinkText={strings.loginLink}
      footerLinkHref="/(auth)/login"
      onNavigateHome={() => router.push("/(public)/home")}
      appTitle={commonStrings.appTitle}
    >
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <AccessibleFormField
            fieldId="registerName"
            accessibilityLabel={commonStrings.nameLabel}
            accessibilityHint={strings.nameFieldHint}
            required
            placeholder={commonStrings.nameLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            placeholderTextColor="#999"
            editable={!loading}
            error={errors.name?.message}
            iconComponent={
              <Ionicons
                name="person-outline"
                size={20}
                color={themeColors.icon}
              />
            }
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AccessibleFormField
            fieldId="registerEmail"
            accessibilityLabel={commonStrings.emailLabel}
            accessibilityHint={strings.emailFieldHint}
            required
            placeholder={commonStrings.emailLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
            editable={!loading}
            error={errors.email?.message}
            iconComponent={
              <Ionicons
                name="mail-outline"
                size={20}
                color={themeColors.icon}
              />
            }
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordField
            fieldId="registerPassword"
            accessibilityLabel={commonStrings.passwordLabel}
            accessibilityHint={strings.passwordFieldHint}
            placeholder={commonStrings.passwordLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={!loading}
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordField
            fieldId="registerConfirmPassword"
            accessibilityLabel={strings.confirmPasswordFieldLabel}
            accessibilityHint={strings.confirmPasswordFieldHint}
            placeholder={strings.confirmPasswordPlaceholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={!loading}
            error={errors.confirmPassword?.message}
            iconName="shield-checkmark-outline"
          />
        )}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#D3D3D3"
          style={[
            authStyles.submitButton,
            { backgroundColor: themeColors.tint },
          ]}
        />
      ) : (
        <TouchableOpacity
          style={[
            authStyles.submitButton,
            { backgroundColor: themeColors.tint },
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={authStyles.submitButtonText}>
            {strings.submitButton}
          </Text>
        </TouchableOpacity>
      )}
    </AuthLayout>
  );
}
