import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Garante que o redirecionamento só aconteça depois do carregamento inicial
    // e se não houver usuário autenticado.
    if (!loading && !user) {
      // Redireciona para a rota de login dentro do grupo (auth)
      router.replace("/(auth)/login");
    }
  }, [loading, user, router]);

  // Retorna o status para que os componentes possam exibir um loading, se necessário.
  return { user, loading };
}
