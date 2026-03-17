import { AccessibleText } from "@/presentation/components/AccessibleText";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import React from "react";
import { ScrollView, Switch, View } from "react-native";

export default function PreferencesScreen() {
  const { preferences, isLoading, updatePreferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";

  if (isLoading) {
    return null; // Don't render until preferences are loaded
  }

  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  return (
    <ScrollView
      style={{ backgroundColor: themeColors.background }}
      contentContainerStyle={sharedStyles.container}
      accessibilityLabel="Tela de preferências"
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
          accessibilityLabel="Título: Personalização"
        >
          Personalização
        </AccessibleText>
      </View>

      {/* Controle de tema */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel="Tema Escuro">
          Tema Escuro
        </AccessibleText>
        <Switch
          value={preferences.theme === "dark"}
          onValueChange={(value: boolean) =>
            updatePreferences({ theme: value ? "dark" : "light" })
          }
          thumbColor={themeColors.background}
          trackColor={{ false: themeColors.icon, true: themeColors.tint }}
          accessibilityLabel="Alternar tema escuro"
          accessibilityRole="switch"
          disabled={preferences.isHighContrast}
        />
      </View>

      {/* Controle de fonte */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel="Fonte Grande">
          Fonte Grande
        </AccessibleText>
        <Switch
          value={preferences.fontSizeMultiplier > 1}
          onValueChange={(value) =>
            updatePreferences({ fontSizeMultiplier: value ? 1.4 : 1 })
          }
          thumbColor={themeColors.background}
          trackColor={{ false: themeColors.icon, true: themeColors.tint }}
          accessibilityLabel="Alternar fonte grande"
          accessibilityRole="switch"
        />
      </View>

      {/* Controle de contraste */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel="Alto Contraste">
          Alto Contraste
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
          thumbColor={themeColors.background}
          trackColor={{ false: themeColors.icon, true: themeColors.tint }}
          accessibilityLabel="Alternar alto contraste"
          accessibilityRole="switch"
        />
      </View>

      {/* Controle de confirmação */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel="Confirmação ao Excluir Tarefa">
          Confirmação ao Excluir Tarefa
        </AccessibleText>
        <Switch
          value={preferences.useExtraConfirmation}
          onValueChange={(value) =>
            updatePreferences({ useExtraConfirmation: value })
          }
          thumbColor={themeColors.background}
          trackColor={{ false: themeColors.icon, true: themeColors.tint }}
          accessibilityLabel="Alternar confirmação ao excluir tarefa"
          accessibilityRole="switch"
        />
      </View>

      {/* Controle de confirmação ao concluir */}
      <View
        style={[sharedStyles.itemRow, { borderBottomColor: themeColors.icon }]}
      >
        <AccessibleText accessibilityLabel="Confirmação ao Concluir Tarefa">
          Confirmação ao Concluir Tarefa
        </AccessibleText>
        <Switch
          value={preferences.confirmOnComplete ?? false}
          onValueChange={(value) =>
            updatePreferences({ confirmOnComplete: value })
          }
          thumbColor={themeColors.background}
          trackColor={{ false: themeColors.icon, true: themeColors.tint }}
          accessibilityLabel="Alternar confirmação ao concluir tarefa"
          accessibilityRole="switch"
        />
      </View>
    </ScrollView>
  );
}
