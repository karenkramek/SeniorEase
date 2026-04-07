import { GlobalNotification } from "@/presentation/components/GlobalNotification";
import { NotificationProvider } from "@/presentation/contexts/NotificationContext";
import { PreferencesProvider } from "@/presentation/contexts/PreferencesContext";
import { usePageTitle } from "@/presentation/hooks/usePageTitle";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  AuthProvider,
  useAuth,
} from "../src/presentation/contexts/AuthContext";

function InitialLayout() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  // Atualiza o título da página na aba do navegador
  usePageTitle();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inPublicGroup = segments[0] === "(public)";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/(tabs)/tasks");
    } else if (!isAuthenticated && !inAuthGroup && !inPublicGroup) {
      // Se é web, deixa acessar a homepage pública
      if (isWeb) {
        // Não redireciona, deixa acessar a rota atual ou homepage
        router.replace("/(public)/home");
      } else {
        // Se é mobile, força para login
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, loading, segments, router, isWeb]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PreferencesProvider>
          <NotificationProvider>
            <InitialLayout />
            <GlobalNotification />
          </NotificationProvider>
        </PreferencesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
