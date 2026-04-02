import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HelpScreen() {
  const { themeColors, colorScheme, preferences } = useTheme();
  const appTexts = useAppStrings();
  const strings = appTexts.help;
  const commonStrings = appTexts.common;
  const insets = useSafeAreaInsets();

  const cardBackground = preferences.isHighContrast
    ? themeColors.tint
    : colorScheme === "dark"
      ? "#23272F"
      : "#E3E7ED";
  const cardText = preferences.isHighContrast
    ? themeColors.buttonText
    : themeColors.text;

  return (
    <ScrollView
        style={{ backgroundColor: themeColors.background }}
        contentContainerStyle={[sharedStyles.container, { paddingBottom: 32, paddingTop: insets.top }]}
        accessibilityLabel={strings.screenLabel}
      >
        <View
          style={[
            sharedStyles.titleContainer,
          ]}
        >
        <AccessibleText
          type="h1"
          accessibilityLabel={`${commonStrings.titleA11yPrefix}: ${strings.title}`}
          style={{ textAlign: "center", fontSize: preferences.fontSizeMultiplier === 1 ? 24 : 32, paddingTop: 24, paddingBottom: 32 }}
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
          borderRadius: 4,
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
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: cardText }}>
          {strings.guideCompleteTask}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: cardText }}>
          {strings.guideFilterTask}
        </AccessibleText>
        <AccessibleText style={{ fontSize: 16, marginBottom: 8, color: cardText }}>
          {strings.guidePreferences}
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
    </ScrollView>
  );
}
