import { GetPreferences } from "@/application/useCases/preferences/GetPreferences";
import { UpdatePreferences } from "@/application/useCases/preferences/UpdatePreferences";
import { Preferences } from "@/domain/entities/Preferences";
import { PreferencesRepository } from "@/infrastructure/repositories/PreferencesRepository";
import { useAuth } from "@/presentation/hooks/useAuth";
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

const preferencesRepository = new PreferencesRepository();
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
  const { user } = useAuth();
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Falha ao carregar as preferências", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const updatePreferences = useCallback(
    async (newPrefs: Partial<Preferences>) => {
      const updated = { ...preferences, ...newPrefs };
      setPreferences(updated);
      try {
        await updatePreferencesUseCase.execute(updated);
      } catch (error) {
        console.error("Falha ao salvar as preferências", error);
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
