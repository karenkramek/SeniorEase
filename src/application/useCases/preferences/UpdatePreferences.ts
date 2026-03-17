import { Preferences } from "@/domain/entities/Preferences";
import { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";

export class UpdatePreferences {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(preferences: Preferences): Promise<Preferences> {
    return this.preferencesRepository.update(preferences);
  }
}
