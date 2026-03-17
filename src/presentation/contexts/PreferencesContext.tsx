import { GetPreferences } from "@/application/useCases/preferences/GetPreferences";
import { UpdatePreferences } from "@/application/useCases/preferences/UpdatePreferences";
import { Preferences } from "@/domain/entities/Preferences";
import { PreferencesRepository } from "@/infrastructure/repositories/PreferencesRepository";
import { UniversalStorageAdapter } from "@/infrastructure/storage/UniversalStorageAdapter";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Valores padrão para as preferências, caso nenhum seja salvo
export const defaultPreferences: Preferences = {
  fontSizeMultiplier: 1,
  isHighContrast: false,
  spacingMultiplier: 1,
  isSimplifiedMode: false,
  useExtraConfirmation: false,
};

// Em um setup com Injeção de Dependência, isto seria injetado.
const storage = new UniversalStorageAdapter();
const preferencesRepository = new PreferencesRepository(storage);
const getPreferencesUseCase = new GetPreferences(preferencesRepository);
const updatePreferencesUseCase = new UpdatePreferences(preferencesRepository);

interface PreferencesContextType {
  preferences: Preferences;
  isLoading: boolean;
  updatePreferences: (prefs: Partial<Preferences>) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  isLoading: true,
  updatePreferences: async () =>
    console.warn("PreferencesProvider não encontrado"),
});

export const usePreferences = () => useContext(PreferencesContext);

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({
  children,
}) => {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        const savedPreferences = await getPreferencesUseCase.execute();
        if (savedPreferences) {
          setPreferences(savedPreferences);
        }
      } catch (error) {
        console.error("Falha ao carregar as preferências", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = useCallback(
    async (newPrefs: Partial<Preferences>) => {
      const updated = { ...preferences, ...newPrefs };
      setPreferences(updated);
      try {
        await updatePreferencesUseCase.execute(updated);
      } catch (error) {
        console.error("Falha ao salvar as preferências", error);
        // Opcional: reverter o estado ou mostrar um erro para o usuário
      }
    },
    [preferences],
  );

  return (
    <PreferencesContext.Provider
      value={{ preferences, isLoading, updatePreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
