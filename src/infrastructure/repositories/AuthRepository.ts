import { User } from "@/domain/entities/User";
import { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { UserMapper } from "@/infrastructure/mappers/UserMapper";
import { auth, db } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    deleteUser,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export class AuthRepository implements IAuthRepository {
  private handleAuthError(error: any): never {
    const errorCode = error.code;

    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/invalid-credentials":
      case "auth/user-not-found":
      case "auth/wrong-password":
        throw new Error(
          "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.",
        );

      case "auth/user-disabled":
        throw new Error(
          "Esta conta foi desativada. Entre em contato com o suporte.",
        );

      case "auth/too-many-requests":
        throw new Error(
          "Muitas tentativas de login. Por favor, aguarde alguns minutos e tente novamente.",
        );

      case "auth/network-request-failed":
        throw new Error(
          "Erro de conexão. Verifique sua internet e tente novamente.",
        );

      case "auth/email-already-in-use":
        throw new Error("Este e-mail já está cadastrado.");

      case "auth/weak-password":
        throw new Error("Senha muito fraca. Use pelo menos 6 caracteres.");

      case "auth/invalid-email":
        throw new Error("E-mail inválido.");

      default:
        throw new Error("Erro ao autenticar. Tente novamente mais tarde.");
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Retorna os dados disponíveis no Firebase Auth imediatamente.
      // O onAuthStateChanged no AuthContext buscará o perfil completo do Firestore
      // em paralelo, sem bloquear nem duplicar a leitura.
      return UserMapper.toDomain(userCredential.user);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
    // Etapa 1: criar a conta no Firebase Auth
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
    } catch (error: any) {
      this.handleAuthError(error);
    }

    // Etapa 2: salvar perfil no Auth e no Firestore
    // Se falhar aqui, removemos a conta recém-criada para que o usuário
    // possa tentar novamente sem receber "e-mail já em uso".
    try {
      await updateProfile(userCredential.user, { displayName: name });

      const user: User = { id: userCredential.user.uid, email, name };

      await setDoc(doc(db, "users", user.id), {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Cria preferências padrão para o novo usuário
      await setDoc(doc(db, "preferences", user.id), {
        fontSizeMultiplier: 1,
        isHighContrast: false,
        spacingMultiplier: 1,
        useExtraConfirmation: false,
        confirmOnComplete: false,
      });

      return user;
    } catch {
      // Rollback: remove a conta do Auth para liberar o e-mail
      await deleteUser(userCredential.user).catch(() => {});
      throw new Error(
        "Erro ao salvar seu perfil. Verifique sua conexão e tente novamente.",
      );
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    // Buscar dados completos do usuário no Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (userDoc.exists()) {
      const data = userDoc.data() as any;
      return { id: userDoc.id, email: data.email, name: data.name };
    }

    // Fallback: se não existir no Firestore, usar dados do Authentication
    return UserMapper.toDomain(firebaseUser);
  }
}
