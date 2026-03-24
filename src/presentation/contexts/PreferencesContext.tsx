import { GetPreferences } from "@/application/useCases/preferences/GetPreferences";
import { UpdatePreferences } from "@/application/useCases/preferences/UpdatePreferences";
import { Preferences } from "@/domain/entities/Preferences";
import { PreferencesRepository } from "@/infrastructure/repositories/PreferencesRepository";
import { UniversalStorageAdapter } from "@/infrastructure/storage/UniversalStorageAdapter";
import { getStrings } from "@/presentation/i18n/strings";
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
  errorMessage: string | null;
  updatePreferences: (prefs: Partial<Preferences>) => Promise<void>;
  clearErrorMessage: () => void;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  isLoading: true,
  errorMessage: null,
  updatePreferences: async () =>
    console.warn("PreferencesProvider não encontrado"),
  clearErrorMessage: () => undefined,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        const savedPreferences = await getPreferencesUseCase.execute();
        if (savedPreferences) {
          setPreferences(savedPreferences);
        }
        setErrorMessage(null);
      } catch (error) {
        console.error("Falha ao carregar as preferências", error);
        setErrorMessage(getStrings("pt-BR").preferences.loadError);
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
      setErrorMessage(null);
      const strings = getStrings("pt-BR").preferences;
      try {
        await updatePreferencesUseCase.execute(updated);
      } catch (error) {
        console.error("Falha ao salvar as preferências", error);
        setErrorMessage(strings.saveError);
      }
    },
    [preferences],
  );

  const clearErrorMessage = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        errorMessage,
        updatePreferences,
        clearErrorMessage,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
