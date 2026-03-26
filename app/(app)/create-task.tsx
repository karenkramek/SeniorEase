import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { showAlert } from "@/presentation/utils/alert";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { createTask } = useTasks();
  const router = useRouter();
  const { themeColors } = useTheme();

  const handleCreate = async () => {
    if (!title.trim()) {
      showAlert("Atenção", "O título da tarefa é obrigatório.");
      return;
    }
    await createTask({
      title: title.trim(),
      description: description.trim(),
    });
    if (router.canGoBack()) {
      router.back();
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
