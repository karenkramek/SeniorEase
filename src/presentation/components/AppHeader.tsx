import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/hooks/useTheme";
import { getWebContentShellStyle } from "@/presentation/theme/platformLayout";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AccessibleButton } from "./AccessibleButton";
import { AccessibleText } from "./AccessibleText";
import { HamburgerMenuButton } from "./HamburgerMenuButton";

interface AppHeaderProps {
  menuOpen?: boolean;
  onMenuToggle?: () => void;
}

export function AppHeader({ menuOpen = false, onMenuToggle }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const { themeColors, isWeb } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { common, navigation, profile } = useAppStrings();

  // Breakpoints
  const isSmallScreen = screenWidth < 640; // Mobile web
  const showHamburgerMenu = screenWidth < 1024; // Tablet e mobile web

  const userName = user?.name || user?.email?.split("@")[0] || profile.userLabel;

  return (
    <View
      style={{
        backgroundColor: themeColors.background,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.icon,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: isWeb ? "space-between" : "flex-start",
          alignItems: "center",
          paddingHorizontal: Spacing.large,
          paddingVertical: Spacing.medium,
          paddingTop: !isWeb ? insets.top + Spacing.medium : Spacing.medium,
          ...getWebContentShellStyle(),
        }}
      >
        {/* Hamburger Menu + Logo (esquerda) */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.medium }}>
          {/* Hamburger button - só aparece em telas menores (< lg) */}
          {isWeb && onMenuToggle && showHamburgerMenu && (
            <HamburgerMenuButton
              isOpen={menuOpen}
              onPress={onMenuToggle}
              accessibilityLabel={menuOpen ? navigation.menuCloseA11y : navigation.menuOpenA11y}
            />
          )}

          {/* Logo */}
          <AccessibleText
            type="h2"
            style={{
              color: themeColors.tint,
              fontWeight: "700",
            }}
            accessibilityLabel={common.appTitle}
          >
            {common.appTitle}
          </AccessibleText>
        </View>

        {/* Seção de perfil à direita (apenas na web) */}
        {isWeb && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.small,
            }}
          >
            {/* Ícone do usuário - escondido em mobile */}
            {!isSmallScreen && (
              <Ionicons
                name="person-circle-outline"
                size={32}
                color={themeColors.tint}
                accessibilityLabel={profile.userIconA11y}
              />
            )}

            {/* Nome do usuário - escondido em mobile */}
            {!isSmallScreen && (
              <AccessibleText
                type="bodyCompact"
                style={{
                  color: themeColors.text,
                }}
                accessibilityLabel={`${profile.userLabel}: ${userName}`}
              >
                {userName}
              </AccessibleText>
            )}

            {/* Botão de logout */}
            <AccessibleButton
              title={profile.logoutButton}
              onPress={signOut}
              accessibilityLabel={profile.logoutButtonA11y}
              icon={
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={themeColors.buttonText}
                  accessibilityLabel={profile.logoutIconA11y}
                />
              }
              style={{
                backgroundColor: themeColors.tint,
                paddingHorizontal: Spacing.medium,
                paddingVertical: Spacing.small,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
