import { GetPreferences } from "@/application/useCases/preferences/GetPreferences";
import { UpdatePreferences } from "@/application/useCases/preferences/UpdatePreferences";
import { Preferences } from "@/domain/entities/Preferences";
import { PreferencesRepository } from "@/infrastructure/repositories/PreferencesRepository";
import { useAuth } from "@/presentation/hooks/useAuth";
import { getStrings } from "@/presentation/i18n/strings";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const defaultPreferences: Preferences = {
  fontSizeMultiplier: 1,
  isHighContrast: false,
  spacingMultiplier: 1,
  useExtraConfirmation: false,
  confirmOnComplete: false,
};

const preferencesRepository = new PreferencesRepository();
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
  const { user } = useAuth();
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPreferences(defaultPreferences);
      setIsLoading(false);
      return;
    }

    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        const savedPreferences = await getPreferencesUseCase.execute();
        if (savedPreferences) {
          setPreferences(savedPreferences);
        } else {
          setPreferences(defaultPreferences);
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
  }, [user]);

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
