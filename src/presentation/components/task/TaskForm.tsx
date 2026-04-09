import { Task } from "@/domain/entities/Task";
import { AccessibleFormField } from "@/presentation/components/shared/AccessibleFormField";
import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { DatePickerModal } from "@/presentation/components/ui/modals/DatePickerModal";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useButtonHeight } from "@/presentation/hooks/useButtonHeight";
import { useNotification } from "@/presentation/hooks/useNotification";
import { useTaskActions } from "@/presentation/hooks/useTaskActions";
import { useTheme } from "@/presentation/hooks/useTheme";
import { isWebPlatform } from "@/presentation/theme/colors";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TaskFormProps {
  task?: Task; // undefined = modo criar, Task = modo editar
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
  showScrollView?: boolean;
}

function formatDueDate(date: Date | string): string {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function TaskForm({
  task,
  onSuccess,
  onCancel,
  isModal = false,
  showScrollView = true,
}: TaskFormProps) {
  const isEditMode = !!task;
  const appTexts = useAppStrings();
  const { themeColors, colorScheme } = useTheme();
  const { createTask, editTask } = useTaskActions();
  const { showNotification } = useNotification();
  const buttonHeight = useButtonHeight();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const minimumBottomSafeSpace =
    Platform.OS === "android" && isModal ? Spacing.xlarge * 2 : Spacing.large;
  const bottomSafeSpace = Math.max(insets.bottom, minimumBottomSafeSpace);
  const actionAreaBottomPadding = isModal
    ? bottomSafeSpace + Spacing.small
    : Spacing.small;
  const formScrollBottomPadding = isModal
    ? bottomSafeSpace + 64
    : bottomSafeSpace + 24;

  const isWeb = isWebPlatform();
  const isSmallScreen = screenWidth < 640;
  const shouldStackButtons = !isWeb || isSmallScreen;
  const actionButtonSizingStyle: ViewStyle = shouldStackButtons
    ? {
        width: "100%",
      }
    : {
        flex: 1,
      };
  const [title, setTitle] = useState(() => task?.title ?? "");
  const [description, setDescription] = useState(() => task?.description ?? "");
  const [dueDate, setDueDate] = useState(() =>
    task?.dueDate ? formatDueDate(task.dueDate) : "",
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Sincroniza campos quando task muda (ex: modal reutilizado com tarefa diferente)
  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description ?? "");
    setDueDate(task.dueDate ? formatDueDate(task.dueDate) : "");
    setTitleError(null);
    setSubmissionError(null);
  }, [task]);

  // Strings de campos são idênticas em createTask e editTask — usa createTask
  const fieldStrings = appTexts.createTask;

  // Sugestões acadêmicas
  const academicSuggestions = [
    "Estudar para prova",
    "Entregar trabalho",
    "Ler capítulo do livro",
    "Revisar anotações",
    "Participar de grupo de estudos",
    "Fazer exercícios da matéria",
  ];

  const handleSubmit = async () => {
    setSubmissionError(null);

    if (!title.trim()) {
      setTitleError(fieldStrings.titleRequiredError);
      return;
    }

    let dueDateTime: Date | undefined = undefined;
    if (dueDate) {
      const separator = dueDate.includes("/") ? "/" : "-";
      const [day, month, year] = dueDate.split(separator).map(Number);
      dueDateTime = new Date(year, month - 1, day);
      if (isNaN(dueDateTime.getTime())) {
        setSubmissionError(fieldStrings.dueDateInvalidError);
        return;
      }
    }

    try {
      if (isEditMode) {
        await editTask(task.id, {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDateTime,
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDateTime,
        });
        setTitle("");
        setDescription("");
        setDueDate("");
      }
      setTitleError(null);
      showNotification(
        isEditMode
          ? appTexts.editTask.editSuccess
          : appTexts.createTask.createSuccess,
        "success",
      );
      onSuccess?.();
    } catch (error) {
      console.error(
        `Falha ao ${isEditMode ? "editar" : "criar"} tarefa`,
        error,
      );
      if (isEditMode && (error as Error).message.includes("concluída")) {
        showNotification(appTexts.editTask.completedTaskError, "error");
        setSubmissionError(appTexts.editTask.completedTaskError);
      } else {
        showNotification(
          isEditMode
            ? appTexts.editTask.editError
            : appTexts.createTask.createError,
          "error",
        );
        setSubmissionError(
          isEditMode
            ? appTexts.editTask.editErrorDetail
            : appTexts.createTask.createErrorDetail,
        );
      }
    }
  };

  const content = (
    <>
      <View style={{ gap: 16 }}>
        <View>
          <AccessibleText
            style={{
              fontWeight: "bold",
              color: themeColors.text,
              marginBottom: 8,
            }}
          >
            {fieldStrings.titleLabel}
          </AccessibleText>
          <AccessibleFormField
            fieldId="taskTitle"
            testID="title-input"
            accessibilityLabel={fieldStrings.titleFieldLabel}
            accessibilityHint={fieldStrings.titleFieldA11yHint}
            required
            placeholder={fieldStrings.titleFieldLabel}
            placeholderTextColor={themeColors.icon}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError && text.trim()) setTitleError(null);
            }}
            error={titleError || undefined}
            style={{ color: themeColors.text }}
            containerStyle={{ marginBottom: 0 }}
            inputContainerStyle={{
              borderColor: titleError ? themeColors.error : themeColors.tint,
              backgroundColor: themeColors.background,
            }}
          />

          {/* Sugestões acadêmicas */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8,
            }}
          >
            {academicSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                onPress={() => setTitle(suggestion)}
                style={{
                  backgroundColor: themeColors.icon + "10",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  marginRight: 6,
                  marginBottom: 6,
                }}
                accessibilityRole="button"
                accessibilityLabel={`Usar sugestão: ${suggestion}`}
              >
                <AccessibleText
                  style={{ color: themeColors.text, fontSize: 13 }}
                >
                  {suggestion}
                </AccessibleText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <AccessibleText
            style={{
              fontWeight: "bold",
              color: themeColors.text,
              marginBottom: 8,
            }}
          >
            {fieldStrings.descriptionLabel}
          </AccessibleText>
          <AccessibleFormField
            fieldId="taskDescription"
            testID="description-input"
            accessibilityLabel={fieldStrings.descriptionFieldA11yLabel}
            accessibilityHint={fieldStrings.descriptionFieldA11yHint}
            placeholder={fieldStrings.descriptionPlaceholder}
            placeholderTextColor={themeColors.icon}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            style={{
              color: themeColors.text,
              textAlignVertical: "top" as "top",
            }}
            containerStyle={{ marginBottom: 0 }}
            inputContainerStyle={{
              backgroundColor: themeColors.background,
              minHeight: 120,
              paddingVertical: 8,
              alignItems: "flex-start",
              borderRadius: 12,
            }}
          />
        </View>

        <View>
          <AccessibleText
            style={{
              fontWeight: "bold",
              color: themeColors.text,
              marginBottom: 8,
            }}
          >
            {fieldStrings.dueDateLabel}
          </AccessibleText>
          <TouchableOpacity
            onPress={() => setIsDatePickerOpen(true)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={fieldStrings.dueDateA11yLabel}
            accessibilityHint={`${fieldStrings.dueDateA11yHintSelected}: ${dueDate || fieldStrings.dueDateA11yHintNone}. ${fieldStrings.dueDateA11yHintAction}`}
            style={{
              borderWidth: 2,
              borderColor:
                colorScheme === "dark" ? "#FFFFFF" : themeColors.tint,
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
              {dueDate || fieldStrings.dueDatePlaceholder}
            </AccessibleText>
            <Ionicons
              name="calendar"
              size={20}
              color={themeColors.icon}
              accessibilityElementsHidden
            />
          </TouchableOpacity>
        </View>
      </View>

      <DatePickerModal
        visible={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateSelect={setDueDate}
        selectedDate={dueDate}
      />

      {submissionError && (
        <AccessibleText
          style={{
            color: themeColors.error,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {submissionError}
        </AccessibleText>
      )}

      <View
        style={{
          marginTop: 24,
          marginBottom: Spacing.small,
          paddingBottom: actionAreaBottomPadding,
          gap: 12,
          flexDirection: shouldStackButtons ? "column" : "row",
          alignItems: "stretch",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <AccessibleButton
          title={
            isEditMode
              ? appTexts.editTask.editButton
              : appTexts.createTask.createButton
          }
          onPress={handleSubmit}
          accessibilityLabel={
            isEditMode
              ? appTexts.editTask.editButtonA11y
              : appTexts.createTask.createButtonA11y
          }
          style={[
            {
              height: buttonHeight,
              borderRadius: 12,
              paddingHorizontal: 24,
              backgroundColor: themeColors.tint,
              borderWidth: 0,
              borderColor: "transparent",
              ...actionButtonSizingStyle,
            },
          ]}
        />
        {onCancel && (
          <AccessibleButton
            title={appTexts.common.cancel}
            onPress={onCancel}
            accessibilityLabel={appTexts.common.cancel}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            textColor={themeColors.text}
            style={[
              {
                height: buttonHeight,
                borderRadius: 12,
                paddingHorizontal: 24,
                borderWidth: 1.5,
                backgroundColor: "transparent",
                borderColor: themeColors.icon,
                ...actionButtonSizingStyle,
              },
            ]}
          />
        )}
      </View>
    </>
  );

  if (!showScrollView) return content;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        alignItems: "stretch",
        justifyContent: "flex-start",
        padding: Spacing.large,
        paddingBottom: formScrollBottomPadding,
      }}
      scrollEnabled
      nestedScrollEnabled
      contentInsetAdjustmentBehavior="always"
      scrollIndicatorInsets={{ bottom: bottomSafeSpace }}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  );
}
