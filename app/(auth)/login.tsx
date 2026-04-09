import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
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
import { Ionicons } from "@expo/vector-icons";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.authLogin;
  const commonStrings = appTexts.common;
  const { signIn } = useAuth();
  const { themeColors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const passwordRef = React.useRef<TextInput>(null);

  const loginSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().email(commonStrings.emailInvalidError),
        password: z.string().min(6, commonStrings.passwordMinError),
      }),
    [commonStrings.emailInvalidError, commonStrings.passwordMinError],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      showAlert(strings.loginErrorTitle, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      formTitle={strings.formTitle}
      footerLinkText={strings.registerLink}
      footerLinkHref="/(auth)/register"
      onNavigateHome={() => router.push("/(public)/home")}
      appTitle={commonStrings.appTitle}
    >
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AccessibleFormField
            fieldId="loginEmail"
            accessibilityLabel={commonStrings.emailLabel}
            accessibilityHint={strings.emailFieldHint}
            required
            placeholder={commonStrings.emailLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={themeColors.icon}
            editable={!loading}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
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
            ref={passwordRef}
            fieldId="loginPassword"
            accessibilityLabel={commonStrings.passwordLabel}
            accessibilityHint={strings.passwordFieldHint}
            placeholder={commonStrings.passwordLabel}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={!loading}
            returnKeyType="go"
            onSubmitEditing={handleSubmit(onSubmit)}
            blurOnSubmit
            error={errors.password?.message}
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
          <Text
            style={[
              authStyles.submitButtonText,
              { color: themeColors.buttonText },
            ]}
          >
            {strings.submitButton}
          </Text>
        </TouchableOpacity>
      )}
    </AuthLayout>
  );
}
