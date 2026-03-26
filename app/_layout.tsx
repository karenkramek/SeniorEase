import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import {
    AuthProvider,
    useAuth,
} from "../src/presentation/contexts/AuthContext";

const InitialLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Não faz nada enquanto o estado de auth está carregando

    const inAuthGroup = segments[0] === "(auth)";

    // Se o usuário está autenticado e está no grupo de autenticação,
    // redireciona para a home do app.
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/(tabs)/tasks");
    }
    // Se o usuário não está autenticado e não está no grupo de autenticação,
    // redireciona para a tela de login.
    else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
