import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import React from "react";
import { View } from "react-native";

export default function HelpScreen() {
  const { themeColors, colorScheme, preferences } = useTheme();

  const cardBackground = preferences.isHighContrast
    ? themeColors.tint
    : colorScheme === "dark"
      ? "#23272F"
      : "#E3E7ED";
  const cardText = preferences.isHighContrast
    ? themeColors.buttonText
    : themeColors.text;

  return (
    <View
      style={[
        sharedStyles.container,
        { backgroundColor: themeColors.background },
      ]}
      accessibilityLabel="Tela de ajuda"
    >
      <View
        style={[
          sharedStyles.titleContainer,
          { borderBottomColor: themeColors.icon },
        ]}
      >
        <AccessibleText
          type="h1"
          accessibilityLabel="Título: Ajuda e Dicas"
          style={{ textAlign: "center" }}
        >
          Ajuda e Dicas
        </AccessibleText>
      </View>
      <AccessibleText
        style={{
          fontSize: 18,
          marginBottom: 16,
          textAlign: "center",
          color: themeColors.text,
        }}
      >
        Dúvidas sobre o app? Veja como usar:
      </AccessibleText>
      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 12,
          padding: 18,
          marginBottom: 20,
          shadowColor: colorScheme === "dark" ? "#000" : "#A0A0A0",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }}
      >
        <AccessibleText
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 12,
            textAlign: "center",
            color: cardText,
          }}
        >
          Como usar o SeniorEase
        </AccessibleText>
        <AccessibleText
          style={{ fontSize: 16, marginBottom: 8, color: cardText }}
        >
          • Adicione tarefas com o botão{" "}
          <AccessibleText
            style={{ color: themeColors.tint, fontWeight: "bold" }}
          >
            Nova Tarefa
          </AccessibleText>
          .
        </AccessibleText>
        <AccessibleText
          style={{ fontSize: 16, marginBottom: 8, color: cardText }}
        >
          • Complete tarefas marcando etapas ou finalizando.
        </AccessibleText>
        <AccessibleText
          style={{ fontSize: 16, marginBottom: 8, color: cardText }}
        >
          • Filtre tarefas para ver as mais importantes ou pendentes.
        </AccessibleText>
        <AccessibleText
          style={{ fontSize: 16, marginBottom: 8, color: cardText }}
        >
          • Personalize o app nas preferências: fonte, contraste, espaçamento.
        </AccessibleText>
      </View>
      <AccessibleText
        style={{
          marginTop: 16,
          fontSize: 18,
          textAlign: "center",
          color: themeColors.text,
        }}
      >
        Qualquer dúvida, estamos aqui para ajudar!
      </AccessibleText>
    </View>
  );
}
