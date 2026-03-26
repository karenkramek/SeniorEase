import {
  AuthContext,
  AuthContextType,
} from "@/presentation/contexts/AuthContext";
import { useContext } from "react";

export function useAuth() {
  const context = useContext<AuthContextType | undefined>(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
