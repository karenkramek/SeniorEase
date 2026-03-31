import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleFormField } from "@/presentation/components/AccessibleFormField";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useNotification } from "@/presentation/hooks/useNotification";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

interface CreateTaskFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
  showScrollView?: boolean;
}

export function CreateTaskForm({
  onSuccess,
  isModal = false,
  showScrollView = true,
}: CreateTaskFormProps) {
  const appTexts = useAppStrings();
  const strings = appTexts.createTask;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { createTask } = useTasks();
  const { showNotification } = useNotification();
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
      setTitle("");
      setDescription("");
      showNotification(strings.createSuccess, "success");
      onSuccess?.();
    } catch (error) {
      console.error("Falha ao criar tarefa", error);
      showNotification(strings.createError, "error");
      setSubmissionError(strings.createErrorDetail);
    }
  };

  const content = (
    <>
      <View style={{ marginBottom: 8 }}>
        <AccessibleText style={{ fontWeight: "bold", color: themeColors.text }}>
          {strings.titleLabel}
        </AccessibleText>
      </View>
      <AccessibleFormField
        fieldId="taskTitle"
        accessibilityLabel={strings.titleFieldA11yLabel}
        accessibilityHint={strings.titleFieldA11yHint}
        required
        placeholder={strings.titlePlaceholder}
        placeholderTextColor={themeColors.icon}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (titleError && text.trim()) {
            setTitleError(null);
          }
        }}
        error={titleError || undefined}
        style={{
          color: themeColors.text,
        }}
        inputContainerStyle={{
          borderColor: titleError ? themeColors.error : themeColors.tint,
          backgroundColor: themeColors.background,
        }}
      />

      <View style={{ marginBottom: 8, marginTop: 16 }}>
        <AccessibleText style={{ fontWeight: "bold", color: themeColors.text }}>
          {strings.descriptionLabel}
        </AccessibleText>
      </View>
      <AccessibleFormField
        fieldId="taskDescription"
        accessibilityLabel={strings.descriptionFieldA11yLabel}
        accessibilityHint={strings.descriptionFieldA11yHint}
        placeholder={strings.descriptionPlaceholder}
        placeholderTextColor={themeColors.icon}
        value={description}
        onChangeText={setDescription}
        error={submissionError || undefined}
        style={{
          color: themeColors.text,
          height: 100,
          textAlignVertical: "top" as "top",
        }}
        inputContainerStyle={{
          borderColor: themeColors.tint,
          backgroundColor: themeColors.background,
          minHeight: 120,
          paddingVertical: 8,
          alignItems: "flex-start",
        }}
      />
      <View style={{ marginTop: 24, marginBottom: isModal ? 0 : 8, alignItems: "center" }}>
        <AccessibleButton
          title={strings.createButton}
          icon={
            <MaterialIcons
              name="add"
              size={32}
              color={themeColors.buttonText}
              accessibilityLabel={appTexts.taskList.addIconA11y}
            />
          }
          onPress={handleCreate}
          accessibilityLabel={strings.createButtonA11y}
          style={sharedStyles.createButton}
        />
      </View>
    </>
  );

  if (!showScrollView) {
    return content;
  }

  return (
    <ScrollView
      contentContainerStyle={[sharedStyles.container, { paddingBottom: 32 }]}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  );
}
