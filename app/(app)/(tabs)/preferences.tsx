import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { getSwitchColors } from "@/presentation/theme/switchColors";
import React from "react";
import { ActivityIndicator, ScrollView, Switch, View } from "react-native";

export default function PreferencesScreen() {
  const strings = useAppStrings().preferences;
  const { preferences, isLoading, updatePreferences } = usePreferences();
  const { themeColors } = useTheme();

  if (isLoading) {
    return (
      <View
        style={[
          { flex: 1, backgroundColor: themeColors.background },
          sharedStyles.loader,
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.tint} />
      </View>
    );
  }

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
          style={{ textAlign: "center" }}
          accessibilityLabel={strings.titleA11y}
        >
          {strings.title}
        </AccessibleText>
      </View>

      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={strings.darkThemeLabel}>
          {strings.darkThemeLabel}
        </AccessibleText>
        <Switch
          value={preferences.theme === "dark"}
          onValueChange={(value: boolean) =>
            updatePreferences({ theme: value ? "dark" : "light" })
          }
          thumbColor={darkThemeSwitchColors.thumbColor}
          ios_backgroundColor={darkThemeSwitchColors.iosBackgroundColor}
          trackColor={darkThemeSwitchColors.trackColor}
          accessibilityLabel={strings.darkThemeSwitchA11y}
          accessibilityRole="switch"
          disabled={preferences.isHighContrast}
        />
      </View>

      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={strings.largeFontLabel}>
          {strings.largeFontLabel}
        </AccessibleText>
        <Switch
          value={preferences.fontSizeMultiplier > 1}
          onValueChange={(value) =>
            updatePreferences({ fontSizeMultiplier: value ? 1.4 : 1 })
          }
          thumbColor={largeFontSwitchColors.thumbColor}
          ios_backgroundColor={largeFontSwitchColors.iosBackgroundColor}
          trackColor={largeFontSwitchColors.trackColor}
          accessibilityLabel={strings.largeFontSwitchA11y}
          accessibilityRole="switch"
        />
      </View>

      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={strings.highContrastLabel}>
          {strings.highContrastLabel}
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
          accessibilityLabel={strings.highContrastSwitchA11y}
          accessibilityRole="switch"
        />
      </View>

      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={strings.deleteConfirmationLabel}>
          {strings.deleteConfirmationLabel}
        </AccessibleText>
        <Switch
          value={preferences.useExtraConfirmation}
          onValueChange={(value) => updatePreferences({ useExtraConfirmation: value })}
          thumbColor={deleteConfirmSwitchColors.thumbColor}
          ios_backgroundColor={deleteConfirmSwitchColors.iosBackgroundColor}
          trackColor={deleteConfirmSwitchColors.trackColor}
          accessibilityLabel={strings.deleteConfirmationSwitchA11y}
          accessibilityRole="switch"
        />
      </View>

      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel={strings.completeConfirmationLabel}>
          {strings.completeConfirmationLabel}
        </AccessibleText>
        <Switch
          value={preferences.confirmOnComplete ?? false}
          onValueChange={(value) => updatePreferences({ confirmOnComplete: value })}
          thumbColor={completeConfirmSwitchColors.thumbColor}
          ios_backgroundColor={completeConfirmSwitchColors.iosBackgroundColor}
          trackColor={completeConfirmSwitchColors.trackColor}
          accessibilityLabel={strings.completeConfirmationSwitchA11y}
          accessibilityRole="switch"
        />
      </View>
    </ScrollView>
  );
}
