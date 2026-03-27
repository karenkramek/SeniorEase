import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useNotification } from "@/presentation/hooks/useNotification";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";

export default function CreateTaskScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.createTask;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { createTask } = useTasks();
  const { showNotification } = useNotification();
  const router = useRouter();
  const { themeColors } = useTheme();

  const handleCreate = async () => {
    setSubmissionError(null);

    if (!title.trim()) {
      setTitleError(strings.titleRequiredError);
      return;
    }

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
      });
      setTitleError(null);
      showNotification(strings.createSuccess, "success");
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error("Falha ao criar tarefa", error);
      showNotification(strings.createError, "error");
      setSubmissionError(strings.createErrorDetail);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[{ flex: 1 }, { backgroundColor: themeColors.background }]}
      accessibilityLabel={strings.screenLabel}
    >
      <ScrollView
        contentContainerStyle={[sharedStyles.container, { paddingBottom: 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 8 }}>
          <AccessibleText style={{ fontWeight: "bold", color: themeColors.text }}>
            {strings.titleLabel}
          </AccessibleText>
        </View>
        <TextInput
          placeholder={strings.titlePlaceholder}
          placeholderTextColor={themeColors.icon}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (titleError && text.trim()) {
              setTitleError(null);
            }
          }}
          style={[
            sharedStyles.input,
            {
              borderColor: titleError ? themeColors.error : themeColors.icon,
              color: themeColors.text,
              backgroundColor: themeColors.background,
            },
          ]}
          accessibilityLabel={strings.titleFieldLabel}
          accessibilityHint={strings.titleRequiredHint}
        />
        {titleError && (
          <View
            style={{ marginTop: -16, marginBottom: 16, flexDirection: "row", gap: 8 }}
            accessibilityRole="alert"
            accessibilityLabel={titleError}
          >
            <MaterialIcons name="error-outline" size={18} color={themeColors.error} />
            <AccessibleText style={{ color: themeColors.error }}>{titleError}</AccessibleText>
          </View>
        )}
        <View style={{ marginBottom: 8 }}>
          <AccessibleText style={{ fontWeight: "bold", color: themeColors.text }}>
            {strings.descriptionLabel}
          </AccessibleText>
        </View>
        <TextInput
          placeholder={strings.descriptionPlaceholder}
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
          accessibilityLabel={strings.descriptionFieldLabel}
        />
        {submissionError && (
          <View
            style={{ marginTop: -8, marginBottom: 8, flexDirection: "row", gap: 8 }}
            accessibilityRole="alert"
            accessibilityLabel={submissionError}
          >
            <MaterialIcons name="error-outline" size={18} color={themeColors.error} />
            <AccessibleText style={{ color: themeColors.error }}>
              {submissionError}
            </AccessibleText>
          </View>
        )}
        <View style={{ marginTop: 24, marginBottom: 8, alignItems: "center" }}>
          <AccessibleButton
            title={strings.createButton}
            icon={
              <MaterialIcons
                name="add"
                size={32}
                color="#fff"
                accessibilityLabel={appTexts.taskList.addIconA11y}
              />
            }
            onPress={handleCreate}
            accessibilityLabel={strings.createButtonA11y}
            style={sharedStyles.createButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
