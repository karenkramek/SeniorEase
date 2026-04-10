import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import { getWebContentShellStyle } from "@/presentation/theme/platformLayout";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { getSwitchColors } from "@/presentation/theme/switchColors";
import React from "react";
import { ActivityIndicator, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.preferences;
  const commonStrings = appTexts.common;
  const { preferences, isLoading, updatePreferences } = usePreferences();
  const { themeColors, isWeb } = useTheme();
  const insets = useSafeAreaInsets();

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
    preferences.confirmOnComplete,
  );

  const switchColumnStyle = {
    // Centralizado verticalmente pelo itemRow
  };

  const webPreferenceRow = isWeb
    ? {
        borderBottomWidth: 0,
        marginBottom: 10,
        borderRadius: 12,
        paddingVertical: 20,
        backgroundColor: getColorWithOpacity(themeColors.tint, 0.07),
        borderWidth: 1,
        borderColor: getColorWithOpacity(themeColors.icon, 0.25),
      }
    : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          sharedStyles.container,
          getWebContentShellStyle(),
          isWeb && { paddingHorizontal: 28, paddingBottom: 32 },
          { paddingTop: Spacing.medium },
        ]}
        accessibilityLabel={strings.screenLabel}
      >
        <View style={[sharedStyles.titleContainer]}>
          <AccessibleText
            type="h1"
            style={{
              textAlign: "center",
              fontSize: preferences.fontSizeMultiplier === 1 ? 24 : 32,
              paddingTop: 0,
              paddingBottom: 32,
            }}
            accessibilityLabel={`${commonStrings.titleA11yPrefix}: ${strings.title}`}
          >
            {strings.title}
          </AccessibleText>
        </View>

        <View
          style={[
            sharedStyles.itemRow,
            { borderBottomColor: themeColors.icon },
            webPreferenceRow,
          ]}
        >
          <View style={sharedStyles.preferenceLabelColumn}>
            <AccessibleText
              type="bodyCompact"
              accessibilityLabel={strings.darkThemeLabel}
            >
              {strings.darkThemeLabel}
            </AccessibleText>
          </View>
          <View style={switchColumnStyle}>
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
        </View>

        <View
          style={[
            sharedStyles.itemRow,
            { borderBottomColor: themeColors.icon },
            webPreferenceRow,
          ]}
        >
          <View style={sharedStyles.preferenceLabelColumn}>
            <AccessibleText
              type="bodyCompact"
              accessibilityLabel={strings.largeFontLabel}
            >
              {strings.largeFontLabel}
            </AccessibleText>
          </View>
          <View style={switchColumnStyle}>
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
        </View>

        <View
          style={[
            sharedStyles.itemRow,
            { borderBottomColor: themeColors.icon },
            webPreferenceRow,
          ]}
        >
          <View style={sharedStyles.preferenceLabelColumn}>
            <AccessibleText
              type="bodyCompact"
              accessibilityLabel={strings.highContrastLabel}
            >
              {strings.highContrastLabel}
            </AccessibleText>
          </View>
          <View style={switchColumnStyle}>
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
        </View>

        <View
          style={[
            sharedStyles.itemRow,
            { borderBottomColor: themeColors.icon },
            webPreferenceRow,
          ]}
        >
          <View style={sharedStyles.preferenceLabelColumn}>
            <AccessibleText
              type="bodyCompact"
              accessibilityLabel={strings.deleteConfirmationLabel}
            >
              {strings.deleteConfirmationLabel}
            </AccessibleText>
          </View>
          <View style={switchColumnStyle}>
            <Switch
              value={preferences.useExtraConfirmation}
              onValueChange={(value) =>
                updatePreferences({ useExtraConfirmation: value })
              }
              thumbColor={deleteConfirmSwitchColors.thumbColor}
              ios_backgroundColor={deleteConfirmSwitchColors.iosBackgroundColor}
              trackColor={deleteConfirmSwitchColors.trackColor}
              accessibilityLabel={strings.deleteConfirmationSwitchA11y}
              accessibilityRole="switch"
            />
          </View>
        </View>

        <View
          style={[
            sharedStyles.itemRow,
            { borderBottomColor: themeColors.icon },
            webPreferenceRow,
          ]}
        >
          <View style={sharedStyles.preferenceLabelColumn}>
            <AccessibleText
              type="bodyCompact"
              accessibilityLabel={strings.completeConfirmationLabel}
            >
              {strings.completeConfirmationLabel}
            </AccessibleText>
          </View>
          <View style={switchColumnStyle}>
            <Switch
              value={preferences.confirmOnComplete}
              onValueChange={(value) =>
                updatePreferences({ confirmOnComplete: value })
              }
              thumbColor={completeConfirmSwitchColors.thumbColor}
              ios_backgroundColor={
                completeConfirmSwitchColors.iosBackgroundColor
              }
              trackColor={completeConfirmSwitchColors.trackColor}
              accessibilityLabel={strings.completeConfirmationSwitchA11y}
              accessibilityRole="switch"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
