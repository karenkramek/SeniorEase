import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
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
import { showAlert } from "@/presentation/utils/alert";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = React.useRef<TextInput>(null);
  const windowWidth = Dimensions.get("window").width;
  const isDesktop = windowWidth >= 768;

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
      showAlert("Erro no Login", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" backgroundColor={"#1F4E79"} />
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
            <Ionicons name="finger-print" size={60} color="#FFFFFF" />
            <Text style={styles.title}>SeniorEase</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Entrar na conta</Text>

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
                    placeholder="E-mail"
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
                  />
                )}
              />
            </View>
            {errors.email && (
              <ThemedText style={styles.errorText}>
                {errors.email.message}
              </ThemedText>
            )}

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
                    ref={passwordRef}
                    style={styles.input}
                    placeholder="Senha"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                    editable={!loading}
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    blurOnSubmit
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

            {loading ? (
              <ActivityIndicator size="large" style={styles.loginButton} />
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Link href="/(auth)/register" style={styles.link}>
              <ThemedText type="link">
                Não tem uma conta? Cadastre-se
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
  loginButton: {
    backgroundColor: "#1F4E79",
    borderRadius: 40,
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
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 5,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "white",
  },
});
