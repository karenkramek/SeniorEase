import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
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
    TextInput,
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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

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
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = React.useRef<TextInput>(null);
  const windowWidth = Dimensions.get("window").width;
  const isDesktop = windowWidth >= 768;

  const navigateHome = () => {
    router.push("/(public)/home");
  };

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" backgroundColor={"#0F766E"} />
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
                  placeholderTextColor="#999"
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
                <View style={styles.passwordFieldWrapper}>
                  <AccessibleFormField
                    ref={passwordRef}
                    fieldId="loginPassword"
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
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    blurOnSubmit
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

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#D3D3D3"
                style={styles.loginButton}
              />
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.loginButtonText}>
                  {strings.submitButton}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Link href="/(auth)/register" style={styles.link}>
              <ThemedText
                type="link"
                style={{
                  color: themeColors.buttonText,
                  fontWeight: "600",
                }}
              >
                {strings.registerLink}
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
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 2,
    height: 48,
    padding: 8,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#0F766E",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    height: 56,
    justifyContent: "center",
  },
  loginButtonText: {
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
