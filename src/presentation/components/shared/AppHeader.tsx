import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { HamburgerMenuButton } from "@/presentation/components/ui/common/HamburgerMenuButton";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/hooks/useTheme";
import { isWebCompactViewport } from "@/presentation/theme/breakpoints";
import { getWebContentShellStyle } from "@/presentation/theme/platformLayout";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  menuOpen?: boolean;
  onMenuToggle?: () => void;
}

export function AppHeader({ menuOpen = false, onMenuToggle }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { themeColors, isWeb } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { common, navigation, profile } = useAppStrings();

  // Breakpoints
  const isSmallScreen = screenWidth < 640; // Mobile web
  const showHamburgerMenu = screenWidth < 1024; // Tablet e mobile web
  const isCompactViewport = isWebCompactViewport(isWeb, screenHeight);
  const isTasksTab = (segments as string[]).includes("tasks");

  const userName =
    user?.name || user?.email?.split("@")[0] || profile.userLabel;

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
          paddingVertical: isCompactViewport ? Spacing.small : Spacing.medium,
          paddingTop: !isWeb
            ? insets.top + Spacing.medium
            : isCompactViewport
              ? Spacing.small
              : Spacing.medium,
          ...getWebContentShellStyle(),
        }}
      >
        {/* Hamburger Menu + Logo (esquerda) */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.medium,
          }}
        >
          {/* Hamburger button - só aparece em telas menores (< lg) */}
          {isWeb && onMenuToggle && showHamburgerMenu && (
            <HamburgerMenuButton
              isOpen={menuOpen}
              onPress={onMenuToggle}
              accessibilityLabel={
                menuOpen ? navigation.menuCloseA11y : navigation.menuOpenA11y
              }
            />
          )}

          {/* Logo */}
          <AccessibleText
            type="h2"
            style={{
              color: themeColors.tint,
              fontWeight: "700",
              fontSize: isCompactViewport ? 22 : undefined,
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
              gap: isCompactViewport ? 6 : Spacing.small,
            }}
          >
            {isCompactViewport && isTasksTab && (
              <AccessibleButton
                title={navigation.createTaskHeaderTitle}
                onPress={() => router.push("/create-task")}
                accessibilityLabel={navigation.createTaskHeaderTitle}
                icon={
                  <Ionicons
                    name="add"
                    size={18}
                    color={themeColors.buttonText}
                  />
                }
                style={{
                  backgroundColor: themeColors.tint,
                  paddingHorizontal: Spacing.small,
                  paddingVertical: Spacing.small,
                }}
              />
            )}

            {/* Ícone do usuário - escondido em mobile */}
            {!isSmallScreen && !isCompactViewport && (
              <Ionicons
                name="person-circle-outline"
                size={32}
                color={themeColors.tint}
                accessibilityLabel={profile.userIconA11y}
              />
            )}

            {/* Nome do usuário - escondido em mobile */}
            {!isSmallScreen && !isCompactViewport && (
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
