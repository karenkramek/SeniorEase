import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { getSwitchColors } from "@/presentation/theme/switchColors";
import React from "react";
import { ScrollView, Switch, View } from "react-native";

export default function PreferencesScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.common;
  const preferencesTexts = appTexts.preferences;
  const {
    preferences,
    isLoading,
    errorMessage,
    clearErrorMessage,
    updatePreferences,
  } = usePreferences();
  const colorScheme = preferences.theme ?? "light";

  if (isLoading) {
    return null; // Don't render until preferences are loaded
  }

  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];
  const darkThemeSwitchColors = getSwitchColors(
    themeColors,
    preferences.theme === "dark",
  );
  const largeFontSwitchColors = getSwitchColors(
    themeColors,
    preferences.fontSizeMultiplier > 1,
  );
  const highContrastSwitchColors = getSwitchColors(
    themeColors,
    preferences.isHighContrast,
  );
  const deleteConfirmSwitchColors = getSwitchColors(
    themeColors,
    preferences.useExtraConfirmation,
  );
  const completeConfirmSwitchColors = getSwitchColors(
    themeColors,
    preferences.confirmOnComplete ?? false,
  );

  return (
    <ScrollView
      style={{ backgroundColor: themeColors.background }}
      contentContainerStyle={sharedStyles.container}
      accessibilityLabel={preferencesTexts.screenLabel}
    >
      <View
        style={[
          sharedStyles.titleContainer,
          { borderBottomColor: themeColors.icon },
        ]}
      >
        <AccessibleText
          type="h1"
          style={{ textAlign: "center" }}
          accessibilityLabel={preferencesTexts.titleA11y}
        >
          {preferencesTexts.title}
        </AccessibleText>
      </View>

      {errorMessage && (
        <View
          style={{
            marginTop: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: themeColors.error,
            borderRadius: 10,
            padding: 12,
            backgroundColor: themeColors.background,
          }}
          accessibilityRole="alert"
          accessibilityLabel={errorMessage}
        >
          <AccessibleText style={{ color: themeColors.error, marginBottom: 8 }}>
            {errorMessage}
          </AccessibleText>
          <AccessibleText
            accessibilityRole="button"
            onPress={clearErrorMessage}
            style={{ color: themeColors.tint, fontWeight: "bold" }}
          >
            {strings.closeMessage}
          </AccessibleText>
        </View>
      )}

      {/* Controle de tema */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={preferencesTexts.darkThemeLabel}>
          {preferencesTexts.darkThemeLabel}
        </AccessibleText>
        <Switch
          value={preferences.theme === "dark"}
          onValueChange={(value: boolean) =>
            updatePreferences({ theme: value ? "dark" : "light" })
          }
          thumbColor={darkThemeSwitchColors.thumbColor}
          ios_backgroundColor={darkThemeSwitchColors.iosBackgroundColor}
          trackColor={darkThemeSwitchColors.trackColor}
          accessibilityLabel={preferencesTexts.darkThemeSwitchA11y}
          accessibilityRole="switch"
          disabled={preferences.isHighContrast}
        />
      </View>

      {/* Controle de fonte */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={preferencesTexts.largeFontLabel}>
          {preferencesTexts.largeFontLabel}
        </AccessibleText>
        <Switch
          value={preferences.fontSizeMultiplier > 1}
          onValueChange={(value) =>
            updatePreferences({ fontSizeMultiplier: value ? 1.4 : 1 })
          }
          thumbColor={largeFontSwitchColors.thumbColor}
          ios_backgroundColor={largeFontSwitchColors.iosBackgroundColor}
          trackColor={largeFontSwitchColors.trackColor}
          accessibilityLabel={preferencesTexts.largeFontSwitchA11y}
          accessibilityRole="switch"
        />
      </View>

      {/* Controle de contraste */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={preferencesTexts.highContrastLabel}>
          {preferencesTexts.highContrastLabel}
        </AccessibleText>
        <Switch
          value={preferences.isHighContrast}
          onValueChange={(value) => {
            if (value) {
              updatePreferences({ isHighContrast: true, theme: "light" });
            } else {
              updatePreferences({ isHighContrast: false });
            }
          }}
          thumbColor={highContrastSwitchColors.thumbColor}
          ios_backgroundColor={highContrastSwitchColors.iosBackgroundColor}
          trackColor={highContrastSwitchColors.trackColor}
          accessibilityLabel={preferencesTexts.highContrastSwitchA11y}
          accessibilityRole="switch"
        />
      </View>

      {/* Controle de confirmação */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={preferencesTexts.deleteConfirmationLabel}>
          {preferencesTexts.deleteConfirmationLabel}
        </AccessibleText>
        <Switch
          value={preferences.useExtraConfirmation}
          onValueChange={(value) =>
            updatePreferences({ useExtraConfirmation: value })
          }
          thumbColor={deleteConfirmSwitchColors.thumbColor}
          ios_backgroundColor={deleteConfirmSwitchColors.iosBackgroundColor}
          trackColor={deleteConfirmSwitchColors.trackColor}
          accessibilityLabel={preferencesTexts.deleteConfirmationSwitchA11y}
          accessibilityRole="switch"
        />
      </View>

      {/* Controle de confirmação ao concluir */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={preferencesTexts.completeConfirmationLabel}>
          {preferencesTexts.completeConfirmationLabel}
        </AccessibleText>
        <Switch
          value={preferences.confirmOnComplete ?? false}
          onValueChange={(value) =>
            updatePreferences({ confirmOnComplete: value })
          }
          thumbColor={completeConfirmSwitchColors.thumbColor}
          ios_backgroundColor={completeConfirmSwitchColors.iosBackgroundColor}
          trackColor={completeConfirmSwitchColors.trackColor}
          accessibilityLabel={preferencesTexts.completeConfirmationSwitchA11y}
          accessibilityRole="switch"
        />
      </View>

    </ScrollView>
  );
}
