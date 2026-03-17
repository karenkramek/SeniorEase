import { Preferences } from "@/domain/entities/Preferences";
import { IPreferencesRepository } from "@/domain/repositories/IPreferencesRepository";

export class GetPreferences {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(): Promise<Preferences | null> {
    return this.preferencesRepository.get();
  }
}
