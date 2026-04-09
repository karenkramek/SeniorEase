import { User } from "@/domain/entities/User";
import { AuthRepository } from "@/infrastructure/repositories/AuthRepository";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

const authRepository = new AuthRepository();

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = user !== null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          try {
            const currentUser = await authRepository.getCurrentUser();
            setUser(currentUser);
          } catch {
            // Firestore offline ou documento ainda não criado (race condition no cadastro):
            // usa os dados já disponíveis no Firebase Auth como fallback
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName ?? undefined,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    const loggedUser = await authRepository.login(email, password);
    setUser(loggedUser);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
  ): Promise<void> => {
    const newUser = await authRepository.signUp(email, password, name);
    setUser(newUser);
  };

  const signOut = async (): Promise<void> => {
    await authRepository.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
