import { Preferences } from "@/domain/entities/Preferences";
import { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";
import { IStorage } from "@/infrastructure/storage/IStorage";

const PREFERENCES_STORAGE_KEY = "preferences";

export class PreferencesRepository implements IPreferencesRepository {
  constructor(private storage: IStorage) {}

  async get(): Promise<Preferences | null> {
    const preferencesJson = await this.storage.getItem(PREFERENCES_STORAGE_KEY);
    return preferencesJson ? JSON.parse(preferencesJson) : null;
  }

  async update(preferences: Preferences): Promise<Preferences> {
    await this.storage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
    return preferences;
  }
}
