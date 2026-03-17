import { Preferences } from "@/domain/entities/Preferences";

export interface IPreferencesRepository {
  get(): Promise<Preferences | null>;
  update(preferences: Preferences): Promise<Preferences>;
}
