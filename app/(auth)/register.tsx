import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { z } from "zod";

import { AccessibleFormField } from "@/presentation/components/shared/AccessibleFormField";
import { ThemedText } from "@/presentation/components/ui/text/ThemedText";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const isDesktop = windowWidth >= 768;

  const navigateHome = () => {
    router.push("/(public)/home");
  };

  const registerSchema = React.useMemo(
    () =>
      z
        .object({
          name: z.string().min(3, strings.nameMinError),
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
      commonStrings.emailInvalidError,
      commonStrings.passwordMinError,
      strings.confirmPasswordRequiredError,
      strings.passwordMismatchError,
    ],
  );

  const {
    control,
    handleSubmit,
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
      showAlert(strings.registerErrorTitle, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" backgroundColor="#0F766E" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
        style={{ backgroundColor: "#0F766E" }}
      >
        <View
          style={[
            styles.contentWrapper,
            isDesktop && styles.contentWrapperDesktop,
          ]}
        >
          {Platform.OS === "web" ? (
            <Pressable
              style={styles.header}
              onPress={navigateHome}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel={`Ir para ${commonStrings.appTitle}`}
            >
              <Ionicons name="finger-print" size={60} color="#FFFFFF" />
              <Text style={styles.title}>{commonStrings.appTitle}</Text>
            </Pressable>
          ) : (
            <View style={styles.header}>
              <Ionicons name="finger-print" size={60} color="#FFFFFF" />
              <Text style={styles.title}>{commonStrings.appTitle}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.formTitle}>{strings.formTitle}</Text>

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
                <View style={styles.passwordFieldWrapper}>
                  <AccessibleFormField
                    fieldId="registerPassword"
                    accessibilityLabel={commonStrings.passwordLabel}
                    accessibilityHint={strings.passwordFieldHint}
                    required
                    placeholder={commonStrings.passwordLabel}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                    editable={!loading}
                    error={errors.password?.message}
                    iconComponent={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={themeColors.icon}
                      />
                    }
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={[
                      styles.eyeIcon,
                      { top: Platform.OS === "web" ? 2 : 5 },
                    ]}
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
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordFieldWrapper}>
                  <AccessibleFormField
                    fieldId="registerConfirmPassword"
                    accessibilityLabel={strings.confirmPasswordFieldLabel}
                    accessibilityHint={strings.confirmPasswordFieldHint}
                    required
                    placeholder={strings.confirmPasswordPlaceholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#999"
                    editable={!loading}
                    error={errors.confirmPassword?.message}
                    iconComponent={
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color={themeColors.icon}
                      />
                    }
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={[
                      styles.eyeIcon,
                      { top: Platform.OS === "web" ? 2 : 5 },
                    ]}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword
                        ? commonStrings.hidePasswordA11y
                        : commonStrings.showPasswordA11y
                    }
                    accessibilityHint={strings.toggleConfirmPasswordHint}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color={themeColors.icon}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#D3D3D3"
                style={styles.registerButton}
              />
            ) : (
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.registerButtonText}>
                  {strings.submitButton}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Link href="/(auth)/login" style={styles.link}>
              <ThemedText
                type="link"
                style={{
                  color: themeColors.buttonText,
                  fontWeight: "600",
                }}
              >
                {strings.loginLink}
              </ThemedText>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F766E",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0F766E",
  },
  contentWrapper: {
    width: "100%",
  },
  contentWrapperDesktop: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  passwordInput: {
    marginBottom: 24,
  },
  passwordFieldWrapper: {
    position: "relative" as const,
  },
  eyeIcon: {
    position: "absolute" as const,
    right: 16,
    top: 2,
    height: 48,
    padding: 8,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#0F766E",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    height: 56,
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
  },
});
