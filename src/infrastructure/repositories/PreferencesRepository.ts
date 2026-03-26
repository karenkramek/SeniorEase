import { Preferences } from "@/domain/entities/Preferences";
import { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function getCurrentUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");
  return uid;
}

export class PreferencesRepository implements IPreferencesRepository {
  async get(): Promise<Preferences | null> {
    try {
      const uid = getCurrentUserId();
      const prefDoc = await getDoc(doc(db, "preferences", uid));
      return prefDoc.exists() ? (prefDoc.data() as Preferences) : null;
    } catch (error) {
      console.error("Erro ao buscar preferências:", error);
      return null;
    }
  }

  async update(preferences: Preferences): Promise<Preferences> {
    try {
      const uid = getCurrentUserId();
      await setDoc(doc(db, "preferences", uid), preferences);
      return preferences;
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      throw new Error("Erro ao salvar preferências no Firestore", {
        cause: error,
      });
    }
  }
}
