import { ThemedText } from "@/presentation/components/ui/text/ThemedText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { type ReactNode } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AuthLayoutProps {
  /** Título dentro do card de formulário */
  formTitle: string;
  /** Conteúdo do formulário (campos + botão submit) */
  children: ReactNode;
  /** Texto do link no footer */
  footerLinkText: string;
  /** Destino do link no footer */
  footerLinkHref: "/(auth)/login" | "/(auth)/register";
  /** Callback para navegar para a home (web) */
  onNavigateHome: () => void;
  /** Nome do app */
  appTitle: string;
}

export function AuthLayout({
  formTitle,
  children,
  footerLinkText,
  footerLinkHref,
  onNavigateHome,
  appTitle,
}: AuthLayoutProps) {
  const { themeColors, preferences } = useTheme();
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get("window").width;
  const isDesktop = windowWidth >= 768;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" backgroundColor={themeColors.tint} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        scrollEnabled
        style={{ backgroundColor: themeColors.tint }}
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
              onPress={onNavigateHome}
              accessible
              accessibilityRole="link"
              accessibilityLabel={`Ir para ${appTitle}`}
            >
              <Ionicons
                name="finger-print"
                size={60}
                color={themeColors.buttonText}
              />
              <Text style={[styles.title, { color: themeColors.buttonText }]}>
                {appTitle}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.header}>
              <Ionicons
                name="finger-print"
                size={60}
                color={themeColors.buttonText}
              />
              <Text style={[styles.title, { color: themeColors.buttonText }]}>
                {appTitle}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.form,
              {
                backgroundColor: themeColors.background,
                borderColor: themeColors.icon + "30",
              },
            ]}
          >
            <Text
              style={[
                styles.formTitle,
                {
                  color: themeColors.text,
                  fontSize: 24 * preferences.fontSizeMultiplier,
                },
              ]}
            >
              {formTitle}
            </Text>
            {children}
          </View>

          <View style={styles.footer}>
            <Link href={footerLinkHref} style={styles.link}>
              <ThemedText
                type="link"
                style={{
                  color: themeColors.buttonText,
                  fontWeight: "600",
                }}
              >
                {footerLinkText}
              </ThemedText>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const authStyles = StyleSheet.create({
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
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    height: 56,
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 12,
    borderWidth: 1,
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
