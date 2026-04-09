import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useButtonHeight } from "@/presentation/hooks/useButtonHeight";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.profile;
  const commonStrings = appTexts.common;
  const { user, signOut } = useAuth();
  const { themeColors, preferences } = useTheme();
  const buttonHeight = useButtonHeight();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        sharedStyles.container,
        {
          backgroundColor: themeColors.background,
          paddingTop: insets.top + Spacing.medium,
        },
      ]}
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
          accessibilityLabel={`${commonStrings.titleA11yPrefix}: ${appTexts.navigation.profileTabTitle}`}
        >
          {appTexts.navigation.profileTabTitle}
        </AccessibleText>
      </View>

      <View style={{ alignItems: "center", paddingVertical: Spacing.large }}>
        <Ionicons
          name="person-circle-outline"
          size={80}
          color={themeColors.tint}
        />
        <AccessibleText
          type="h2"
          style={{ marginTop: Spacing.small, color: themeColors.text }}
          accessibilityLabel={`${strings.nameA11yPrefix}: ${user?.name ?? strings.userLabel}`}
        >
          {user?.name ?? strings.userLabel}
        </AccessibleText>
        <AccessibleText
          type="caption"
          style={{ color: themeColors.icon, marginTop: 4 }}
          accessibilityLabel={`${commonStrings.emailLabel}: ${user?.email ?? ""}`}
        >
          {user?.email ?? ""}
        </AccessibleText>
      </View>

      <View style={{ marginTop: 24, marginBottom: 8, alignItems: "center" }}>
        <AccessibleButton
          title={strings.logoutButton}
          onPress={signOut}
          accessibilityLabel={strings.logoutButtonA11y}
          icon={
            <Ionicons
              name="log-out-outline"
              size={32}
              color={themeColors.buttonText}
              accessibilityLabel={strings.logoutIconA11y}
            />
          }
          style={[sharedStyles.createButton, { height: buttonHeight }]}
        />
      </View>
    </View>
  );
}
