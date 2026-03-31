import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

  // Breakpoints
  const isSmallScreen = screenWidth < 640; // Mobile web
  const showHamburgerMenu = screenWidth < 1024; // Tablet e mobile web

  const userName = user?.name || user?.email?.split("@")[0] || "Usuário";

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
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
        }}
      >
        {/* Hamburger Menu + Logo (esquerda) */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.medium }}>
          {/* Hamburger button - só aparece em telas menores (< lg) */}
          {isWeb && onMenuToggle && showHamburgerMenu && (
            <HamburgerMenuButton
              isOpen={menuOpen}
              onPress={onMenuToggle}
              accessibilityLabel={menuOpen ? "Fechar menu" : "Abrir menu"}
            />
          )}

          {/* Logo */}
          <AccessibleText
            type="h2"
            style={{
              color: themeColors.tint,
              fontWeight: "700",
            }}
            accessibilityLabel="SeniorEase"
          >
            SeniorEase
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
                accessibilityLabel={`Ícone do usuário`}
              />
            )}

            {/* Nome do usuário - escondido em mobile */}
            {!isSmallScreen && (
              <AccessibleText
                type="bodyCompact"
                style={{
                  color: themeColors.text,
                }}
                accessibilityLabel={`Usuário: ${userName}`}
              >
                {userName}
              </AccessibleText>
            )}

            {/* Botão de logout */}
            <AccessibleButton
              title="Sair"
              onPress={signOut}
              accessibilityLabel="Deslogar"
              icon={
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={themeColors.buttonText}
                  accessibilityLabel="Ícone de logout"
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
    </SafeAreaView>
  );
}
