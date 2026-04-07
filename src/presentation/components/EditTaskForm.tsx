import { Task } from "@/domain/entities/Task";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleFormField } from "@/presentation/components/AccessibleFormField";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { DatePickerModal } from "@/presentation/components/DatePickerModal";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useNotification } from "@/presentation/hooks/useNotification";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

interface EditTaskFormProps {
  task: Task;
  onSuccess?: () => void;
  isModal?: boolean;
  showScrollView?: boolean;
}

export function EditTaskForm({
  task,
  onSuccess,
  isModal = false,
  showScrollView = true,
}: EditTaskFormProps) {
  const appTexts = useAppStrings();
  const strings = appTexts.editTask;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // Format: "dd/mm/yyyy"
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { editTask } = useTasks();
  const { showNotification } = useNotification();
  const { themeColors } = useTheme();

  // Initialize form with task data
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setDueDate(`${day}/${month}/${year}`);
    }
  }, [task]);

  const handleEdit = async () => {
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

      await editTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDateTime,
      });
      setTitleError(null);
      showNotification(strings.editSuccess, "success");
      onSuccess?.();
    } catch (error) {
      console.error("Falha ao editar tarefa", error);
      if ((error as Error).message.includes("concluída")) {
        showNotification(strings.completedTaskError, "error");
        setSubmissionError(strings.completedTaskError);
      } else {
        showNotification(strings.editError, "error");
        setSubmissionError(strings.editErrorDetail);
      }
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
        multiline
        numberOfLines={5}
        style={{
          color: themeColors.text,
          textAlignVertical: "top" as "top",
        }}
        inputContainerStyle={{
          borderColor: themeColors.tint,
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
          borderColor: themeColors.tint,
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
          alignItems: "center",
        }}
      >
        <AccessibleButton
          title={strings.editButton}
          icon={
            <MaterialIcons
              name="edit"
              size={32}
              color={themeColors.buttonText}
              accessibilityLabel="Ícone de editar"
            />
          }
          onPress={handleEdit}
          accessibilityLabel={strings.editButtonA11y}
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
