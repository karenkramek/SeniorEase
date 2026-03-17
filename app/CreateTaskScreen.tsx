import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTasks } from "@/presentation/hooks/useTasks";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { createTask } = useTasks();
  const router = useRouter();

  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  const handleCreate = async () => {
    if (title.trim()) {
      await createTask({
        title: title.trim(),
        description: description.trim(),
      });
      if (router.canGoBack()) {
        router.back();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        sharedStyles.container,
        { backgroundColor: themeColors.background },
      ]}
      accessibilityLabel="Tela de criação de tarefa"
    >
      <TextInput
        placeholder="Título da tarefa"
        placeholderTextColor={themeColors.icon}
        value={title}
        onChangeText={setTitle}
        style={[
          sharedStyles.input,
          {
            borderColor: themeColors.icon,
            color: themeColors.text,
            backgroundColor: themeColors.background,
          },
        ]}
        accessibilityLabel="Campo para título da tarefa"
      />
      <TextInput
        placeholder="Descrição (opcional)"
        placeholderTextColor={themeColors.icon}
        value={description}
        onChangeText={setDescription}
        style={[
          sharedStyles.input,
          {
            borderColor: themeColors.icon,
            color: themeColors.text,
            backgroundColor: themeColors.background,
            height: 120,
            textAlignVertical: "top" as "top",
          },
        ]}
        multiline
        accessibilityLabel="Campo para descrição da tarefa"
      />
      {/* Espaço para separar os campos do botão */}
      <View style={{ flex: 1 }} />
      <View style={{ marginTop: 24, marginBottom: 8, alignItems: "center" }}>
        <AccessibleButton
          title="Criar Tarefa"
          icon={
            <MaterialIcons
              name="add"
              size={32}
              color="#fff"
              accessibilityLabel="Ícone de adicionar"
            />
          }
          onPress={handleCreate}
          accessibilityLabel="Botão para criar tarefa"
          style={sharedStyles.createButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
