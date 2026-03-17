import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import { PreferencesProvider } from "@/presentation/contexts/PreferencesContext";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PreferencesProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="ModalScreen"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="CreateTaskScreen"
            options={{ presentation: "modal", title: "Nova Tarefa" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PreferencesProvider>
  );
}
