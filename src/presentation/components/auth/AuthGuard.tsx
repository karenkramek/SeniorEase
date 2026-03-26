import { ThemedView } from "@/presentation/components/ThemedView";
import { useRequireAuth } from "@/presentation/hooks/useRequireAuth";
import { useTheme } from "@/presentation/hooks/useTheme";
import React from "react";
import { ActivityIndicator } from "react-native";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { loading, user } = useRequireAuth();
  const { themeColors } = useTheme();

  if (loading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={themeColors.tint} />
      </ThemedView>
    );
  }

  if (!user) {
    // Se não houver usuário, o hook useRequireAuth já está cuidando do redirecionamento.
    // Retornar null evita que qualquer conteúdo seja renderizado brevemente antes de redirecionar.
    return null;
  }

  // Se o usuário estiver autenticado, renderiza o conteúdo protegido.
  return <>{children}</>;
}
