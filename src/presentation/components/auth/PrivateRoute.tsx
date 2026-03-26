import { useRequireAuth } from "@/presentation/hooks/useRequireAuth";
import React, { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return null; // useRequireAuth já redireciona para login
  }

  return <>{children}</>;
}
