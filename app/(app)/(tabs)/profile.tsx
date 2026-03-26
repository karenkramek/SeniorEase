import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { themeColors } = useTheme();

  return (
    <View
      style={[
        sharedStyles.container,
        { backgroundColor: themeColors.background },
      ]}
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
          accessibilityLabel="Título: Perfil"
        >
          Perfil
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
          accessibilityLabel={`Nome: ${user?.name ?? "Usuário"}`}
        >
          {user?.name ?? "Usuário"}
        </AccessibleText>
        <AccessibleText
          type="caption"
          style={{ color: themeColors.icon, marginTop: 4 }}
          accessibilityLabel={`E-mail: ${user?.email ?? ""}`}
        >
          {user?.email ?? ""}
        </AccessibleText>
      </View>

      <View style={{ marginTop: 24, marginBottom: 8, alignItems: "center" }}>
        <AccessibleButton
          title="Sair"
          onPress={signOut}
          accessibilityLabel="Botão para sair da conta"
          icon={
            <Ionicons
              name="log-out-outline"
              size={32}
              color="#fff"
              accessibilityLabel="Ícone de sair"
            />
          }
          style={sharedStyles.createButton}
        />
      </View>
    </View>
  );
}
