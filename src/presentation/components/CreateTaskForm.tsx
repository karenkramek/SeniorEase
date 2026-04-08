import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleFormField } from "@/presentation/components/AccessibleFormField";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { DatePickerModal } from "@/presentation/components/DatePickerModal";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useButtonHeight } from "@/presentation/hooks/useButtonHeight";
import { useNotification } from "@/presentation/hooks/useNotification";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useTheme } from "@/presentation/hooks/useTheme";
import { isWebPlatform } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, useWindowDimensions } from "react-native";

interface CreateTaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
  showScrollView?: boolean;
}

export function CreateTaskForm({
  onSuccess,
  onCancel,
  isModal = false,
  showScrollView = true,
}: CreateTaskFormProps) {
  const appTexts = useAppStrings();
  const strings = appTexts.createTask;
  const { width: screenWidth } = useWindowDimensions();
  const buttonHeight = useButtonHeight();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Sugestões acadêmicas
  const academicSuggestions = [
    "Estudar para prova",
    "Entregar trabalho",
    "Ler capítulo do livro",
    "Revisar anotações",
    "Participar de grupo de estudos",
    "Fazer exercícios da matéria"
  ];
  const [dueDate, setDueDate] = useState(""); // Format: "dd/mm/yyyy"
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { createTask } = useTasks();
  const { showNotification } = useNotification();
  const { themeColors, colorScheme } = useTheme();

  const isWeb = isWebPlatform();
  const isSmallScreen = screenWidth < 640;
  const shouldStackButtons = !isWeb || (isWeb && isSmallScreen);

  const handleCreate = async () => {
    setSubmissionError(null);

    if (!title.trim()) {
      setTitleError(strings.titleRequiredError);
      return;
    }

    try {
      let dueDateTime: Date | undefined = undefined;

      if (dueDate) {
        // Convert from dd/mm/yyyy or dd-mm-yyyy to Date
        const separator = dueDate.includes("/") ? "/" : "-";
        const [day, month, year] = dueDate.split(separator).map(Number);
        dueDateTime = new Date(year, month - 1, day);

        // Validate date
        if (isNaN(dueDateTime.getTime())) {
          setSubmissionError(strings.dueDateInvalidError);
          return;
        }
      }

      await createTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDateTime,
      });
      setTitleError(null);
      setTitle("");
      setDescription("");
      setDueDate("");
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
        accessibilityLabel={strings.titleFieldLabel}
        accessibilityHint={strings.titleFieldA11yHint}
        required
        placeholder={strings.titleFieldLabel}
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
          borderColor: titleError ? themeColors.error : undefined,
          backgroundColor: themeColors.background,
        }}
      />

      {/* Sugestões acadêmicas */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {academicSuggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion}
            onPress={() => setTitle(suggestion)}
            style={{
              backgroundColor: themeColors.icon + '10',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              marginRight: 6,
              marginBottom: 6,
            }}
            accessibilityRole="button"
            accessibilityLabel={`Usar sugestão: ${suggestion}`}
          >
            <AccessibleText style={{ color: themeColors.text, fontSize: 13 }}>{suggestion}</AccessibleText>
          </TouchableOpacity>
        ))}
      </View>

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
        multiline
        numberOfLines={5}
        style={{
          color: themeColors.text,
          textAlignVertical: "top" as "top",
        }}
        inputContainerStyle={{
          backgroundColor: themeColors.background,
          minHeight: 120,
          paddingVertical: 8,
          alignItems: "flex-start",
          borderRadius: 12,
        }}
      />

      <View style={{ marginBottom: 8, marginTop: 16 }}>
        <AccessibleText style={{ fontWeight: "bold", color: themeColors.text }}>
          {strings.dueDateLabel}
        </AccessibleText>
      </View>
      <TouchableOpacity
        onPress={() => setIsDatePickerOpen(true)}
        accessible
        accessibilityRole="button"
        accessibilityLabel={strings.dueDateA11yLabel}
        accessibilityHint={`${strings.dueDateA11yHintSelected}: ${dueDate || strings.dueDateA11yHintNone}. ${strings.dueDateA11yHintAction}`}
        style={{
          borderWidth: 2,
          borderColor: colorScheme === 'dark' ? '#FFFFFF' : themeColors.tint,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: themeColors.background,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 48,
        }}
      >
        <AccessibleText
          style={{
            color: dueDate ? themeColors.text : themeColors.icon,
            fontSize: 16,
          }}
        >
          {dueDate || strings.dueDatePlaceholder}
        </AccessibleText>
        <Ionicons
          name="calendar"
          size={20}
          color={themeColors.icon}
          accessibilityElementsHidden
        />
      </TouchableOpacity>

      <DatePickerModal
        visible={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateSelect={setDueDate}
        selectedDate={dueDate}
      />
      <View
        style={{
          marginTop: 24,
          marginBottom: isModal ? 0 : 8,
          gap: 12,
          flexDirection: shouldStackButtons ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginHorizontal: "auto",
        }}
      >
        <AccessibleButton
          title={strings.createButton}
          onPress={handleCreate}
          accessibilityLabel={strings.createButtonA11y}
          style={[
            sharedStyles.secondaryButton,
            {
              height: buttonHeight,
              backgroundColor: themeColors.tint,
              borderWidth: 0,
              borderColor: "transparent",
            },
          ]}
        />
        {onCancel && (
          <AccessibleButton
            title={strings.cancelButton}
            onPress={onCancel}
            accessibilityLabel={strings.cancelButton}
            textColor={themeColors.text}
            style={[
              sharedStyles.secondaryButton,
              {
                height: buttonHeight,
                backgroundColor: "transparent",
                borderColor: themeColors.icon,
              },
            ]}
          />
        )}
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
