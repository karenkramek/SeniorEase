import { AccessibleText } from "@/presentation/components/AccessibleText";
import { ThemedView } from "@/presentation/components/ThemedView";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import React from "react";
import { View } from "react-native";

export default function HelpScreen() {
  const strings = useAppStrings().help;
  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  // Card de dicas: cor adaptada ao tema
  const cardBackground = preferences.isHighContrast
    ? themeColors.tint
    : colorScheme === "dark"
      ? "#23272F"
      : "#E3E7ED"; // Cinza mais escuro para o tema claro
  const cardText = preferences.isHighContrast
    ? themeColors.buttonText
    : colorScheme === "dark"
      ? themeColors.text
      : themeColors.text;

  return (
    <ThemedView
      style={[
        sharedStyles.container,
        { backgroundColor: themeColors.background },
      ]}
      accessibilityLabel={strings.screenLabel}
    >
      <View
        style={[
          sharedStyles.titleContainer,
          { borderBottomColor: themeColors.icon },
        ]}
      >
        <AccessibleText
          type="h1"
          accessibilityLabel={`${strings.titleA11yPrefix}: ${strings.title}`}
          style={{ textAlign: "center" }}
        >
          {strings.title}
        </AccessibleText>
      </View>
      <AccessibleText
        style={{
          fontSize: 18,
          marginBottom: 16,
          textAlign: "center",
          color: themeColors.text,
        }}
      >
        {strings.intro}
      </AccessibleText>
      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 12,
          padding: 18,
          marginBottom: 20,
          shadowColor: colorScheme === "dark" ? "#000" : "#A0A0A0",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }}
      >
        <AccessibleText
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 12,
            textAlign: "center",
            color: cardText,
          }}
        >
          {strings.guideTitle}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: cardText }}>
          {strings.guideAddTask}
        </AccessibleText>
        <AccessibleText
          style={{ fontSize: 16, marginBottom: 8, color: cardText }}
        >
          {strings.guideCompleteTask}
        </AccessibleText>
        <AccessibleText
          style={{ fontSize: 16, marginBottom: 8, color: cardText }}
        >
          {strings.guideFilterTask}
        </AccessibleText>
        <AccessibleText
          style={{ fontSize: 16, marginBottom: 8, color: cardText }}
        >
          {strings.guidePreferences}
        </AccessibleText>
      </View>

      <View
        style={{
          backgroundColor: themeColors.background,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: themeColors.icon,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <AccessibleText
          type="h2"
          style={{ marginBottom: 10, textAlign: "center" }}
          accessibilityLabel={strings.a11yTitle}
        >
          {strings.a11yTitle}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: themeColors.text }}>
          {strings.a11yFontContrast}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: themeColors.text }}>
          {strings.a11yConfirmations}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: themeColors.text }}>
          {strings.a11yWebKeyboard}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: themeColors.text }}>
          {strings.a11yMobileReader}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, color: themeColors.text }}>
          {strings.a11yAnnouncements}
        </AccessibleText>
      </View>

      <AccessibleText
        style={{
          marginTop: 16,
          fontSize: 18,
          textAlign: "center",
          color: themeColors.text,
        }}
      >
        {strings.footer}
      </AccessibleText>
    </ThemedView>
  );
}
