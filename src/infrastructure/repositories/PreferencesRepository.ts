import { Preferences } from "@/domain/entities/Preferences";
import { FirestoreException } from "@/domain/exceptions";
import { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import { getCurrentUserId } from "@/infrastructure/utils/getCurrentUserId";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
      throw new FirestoreException(
        "Erro ao salvar preferências no Firestore",
        error,
      );
    }
  }
}
