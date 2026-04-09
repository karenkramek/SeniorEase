import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import { getWebContentShellStyle } from "@/presentation/theme/platformLayout";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FEATURE_CARDS = [
  { icon: "➕", titleKey: "addTaskTitle", descKey: "addTaskDescription" },
  { icon: "✏️", titleKey: "editTaskTitle", descKey: "editTaskDescription" },
  { icon: "🔍", titleKey: "filterTaskTitle", descKey: "filterTaskDescription" },
  {
    icon: "✅",
    titleKey: "completeTaskTitle",
    descKey: "completeTaskDescription",
  },
  {
    icon: "⚙️",
    titleKey: "preferencesTitle",
    descKey: "preferencesDescription",
  },
] as const;

export default function HelpScreen() {
  const { themeColors, preferences, isWeb } = useTheme();
  const appTexts = useAppStrings();
  const strings = appTexts.help;
  const commonStrings = appTexts.common;
  const insets = useSafeAreaInsets();

  const baseFontSize = preferences.fontSizeMultiplier === 1 ? 1 : 1.25;

  const webItemRow = isWeb
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
          {
            alignItems: "stretch",
            justifyContent: "flex-start",
            padding: Spacing.large,
          },
          getWebContentShellStyle(),
          isWeb && { paddingHorizontal: 28, paddingBottom: 32 },
          {
            paddingTop: insets.top + Spacing.medium,
            paddingBottom: insets.bottom + Spacing.large,
          },
        ]}
        scrollEnabled
        nestedScrollEnabled
        contentInsetAdjustmentBehavior="always"
        scrollIndicatorInsets={{ bottom: insets.bottom + Spacing.medium }}
        accessibilityLabel={strings.screenLabel}
      >
        <View style={sharedStyles.titleContainer}>
          <AccessibleText
            type="h1"
            accessibilityLabel={`${commonStrings.titleA11yPrefix}: ${strings.title}`}
            style={{
              textAlign: "center",
              fontSize: preferences.fontSizeMultiplier === 1 ? 24 : 32,
              paddingTop: 0,
              paddingBottom: 32,
            }}
          >
            {strings.title}
          </AccessibleText>
        </View>

        {FEATURE_CARDS.map((card) => (
          <View
            key={card.titleKey}
            style={[
              sharedStyles.itemRow,
              { borderBottomColor: themeColors.icon, alignItems: "flex-start" },
              webItemRow,
            ]}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${strings[card.titleKey]}: ${strings[card.descKey]}`}
          >
            <AccessibleText
              style={{
                fontSize: baseFontSize * 22,
                marginRight: Spacing.medium,
                marginTop: 2,
              }}
              importantForAccessibility="no"
            >
              {card.icon}
            </AccessibleText>
            <View style={{ flex: 1 }}>
              <AccessibleText
                style={{
                  fontWeight: "700",
                  fontSize: baseFontSize * 16,
                  color: themeColors.text,
                  marginBottom: 4,
                }}
                importantForAccessibility="no"
              >
                {strings[card.titleKey]}
              </AccessibleText>
              <AccessibleText
                style={{
                  fontSize: baseFontSize * 14,
                  color: themeColors.text,
                  opacity: 0.75,
                  lineHeight: baseFontSize * 20,
                }}
                importantForAccessibility="no"
              >
                {strings[card.descKey]}
              </AccessibleText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
