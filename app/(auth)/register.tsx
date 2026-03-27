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
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { z } from "zod";

import { ThemedText } from "@/presentation/components/ThemedText";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { showAlert } from "@/presentation/utils/alert";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const strings = useAppStrings().authRegister;
  const commonStrings = useAppStrings().common;
  const { signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const isDesktop = windowWidth >= 768;

  const registerSchema = React.useMemo(
    () =>
      z
        .object({
          name: z.string().min(3, strings.nameMinError),
          email: z.string().email(strings.emailInvalidError),
          password: z.string().min(6, strings.passwordMinError),
          confirmPassword: z.string().min(6, strings.confirmPasswordRequiredError),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: strings.passwordMismatchError,
          path: ["confirmPassword"],
        }),
    [
      strings.nameMinError,
      strings.emailInvalidError,
      strings.passwordMinError,
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
      showAlert(
        strings.successTitle,
        strings.successBody,
        [{ text: commonStrings.ok, onPress: () => router.replace("/(auth)/login") }],
      );
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
      <StatusBar style="light" backgroundColor="#1F4E79" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.contentWrapper,
            isDesktop && styles.contentWrapperDesktop,
          ]}
        >
          <View style={styles.header}>
            <Ionicons name="person-add-outline" size={60} color="#FFFFFF" />
            <Text style={styles.title}>{strings.appTitle}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>{strings.formTitle}</Text>

            {/* Nome */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={strings.namePlaceholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                )}
              />
            </View>
            {errors.name && (
              <ThemedText style={styles.errorText}>
                {errors.name.message}
              </ThemedText>
            )}

            {/* E-mail */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={strings.emailPlaceholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                )}
              />
            </View>
            {errors.email && (
              <ThemedText style={styles.errorText}>
                {errors.email.message}
              </ThemedText>
            )}

            {/* Senha */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={strings.passwordPlaceholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <ThemedText style={styles.errorText}>
                {errors.password.message}
              </ThemedText>
            )}

            {/* Confirmar senha */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={strings.confirmPasswordPlaceholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#999"
                    editable={!loading}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <ThemedText style={styles.errorText}>
                {errors.confirmPassword.message}
              </ThemedText>
            )}

            {loading ? (
              <ActivityIndicator size="large" style={styles.registerButton} />
            ) : (
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.registerButtonText}>{strings.submitButton}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Link href="/(auth)/login" style={styles.link}>
              <ThemedText type="link">{strings.loginLink}</ThemedText>
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
    backgroundColor: "#1F4E79",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
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
    borderRadius: 16,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1F4E79",
    borderRadius: 40,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: "#1F4E79",
    borderRadius: 40,
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
  errorText: {
    color: "#ff4444",
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 14,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "white",
  },
});
