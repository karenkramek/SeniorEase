import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import { GlobalNotification } from "@/presentation/components/GlobalNotification";
import { NotificationProvider } from "@/presentation/contexts/NotificationContext";
import { PreferencesProvider } from "@/presentation/contexts/PreferencesContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootNavigator() {
  const appTexts = useAppStrings();
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="ModalScreen"
          options={{
            presentation: "modal",
            title: appTexts.navigation.modalHeaderTitle,
          }}
        />
        <Stack.Screen
          name="CreateTaskScreen"
          options={{
            presentation: "modal",
            title: appTexts.navigation.createTaskHeaderTitle,
          }}
        />
      </Stack>
      <GlobalNotification />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <NotificationProvider>
        <RootNavigator />
      </NotificationProvider>
    </PreferencesProvider>
  );
}
