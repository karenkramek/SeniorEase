import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthGuard } from "@/presentation/components/auth/AuthGuard";
import { PreferencesProvider } from "@/presentation/contexts/PreferencesContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { TaskRepositoryProvider } from "@/presentation/contexts/TaskRepositoryContext";
import { usePreferences } from "@/presentation/hooks/usePreferences";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function AppLayout() {
  const appTexts = useAppStrings();
  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthGuard>
        <TaskRepositoryProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                title: appTexts.navigation.modalHeaderTitle,
              }}
            />
            <Stack.Screen
              name="create-task"
              options={{
                presentation: "modal",
                title: appTexts.navigation.createTaskHeaderTitle,
              }}
            />
            <Stack.Screen
              name="task-details"
              options={{ title: appTexts.navigation.taskDetailsHeaderTitle }}
            />
          </Stack>
        </TaskRepositoryProvider>
      </AuthGuard>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <AppLayout />
    </PreferencesProvider>
  );
}
