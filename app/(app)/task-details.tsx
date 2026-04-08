import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { ConfirmModal } from "@/presentation/components/ConfirmModal";
import { EditTaskModal } from "@/presentation/components/EditTaskModal";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useConfirmationFlow } from "@/presentation/hooks/useConfirmationFlow";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { formatDateLong } from "@/presentation/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View, useWindowDimensions } from "react-native";

export default function TaskDetailsScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.taskDetails;
  const commonStrings = appTexts.common;
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { themeColors } = useTheme();
  const { preferences } = usePreferences();
  const { width: windowWidth } = useWindowDimensions();

  // Responsive: Mobile < 640px (stacked), Tablet+ >= 640px (side-by-side)
  const isSmallScreen = windowWidth < 640;

  const taskRepository = useTaskRepository();
  const completeTaskUseCase = useMemo(
    () => new CompleteTask(taskRepository),
    [taskRepository],
  );

  const {
    isOpen,
    options,
    handleConfirm,
    handleCancel,
    showConfirmation,
    showSuccess,
    showError,
  } = useConfirmationFlow();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!taskId) return;
      const found = await taskRepository.findById(taskId);
      setTask(found);
      setLoading(false);
    };
    load();
  }, [taskId, taskRepository]);

  const handleCompleteTask = async () => {
    if (!task) return;

    if (preferences?.confirmOnComplete) {
      showConfirmation({
        title: appTexts.taskList.confirmCompleteTitle,
        message: appTexts.taskList.confirmCompleteMessage,
        confirmText: appTexts.taskList.confirmCompleteAction,
        cancelText: commonStrings.cancel,
        iconName: "checkmark-circle",
        onConfirm: async () => {
          try {
            await completeTaskUseCase.execute(task.id);
            showSuccess({
              message: appTexts.taskList.taskCompleted,
              duration: 6000,
            });
            setTimeout(() => router.back(), 1000);
          } catch (_error) {
            console.log(_error);
            showError(strings.completeError);
          }
        },
      });
    } else {
      try {
        await completeTaskUseCase.execute(task.id);
        showSuccess({
          message: appTexts.taskList.taskCompleted,
          duration: 6000,
        });
        setTimeout(() => router.back(), 1000);
      } catch (_error) {
        console.log(_error);
        showError(strings.completeError);
      }
    }
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    // Recarregar os dados da tarefa
    if (taskId) {
      const updated = await taskRepository.findById(taskId);
      setTask(updated);
    }
  };

  const containerStyle = { flex: 1, backgroundColor: themeColors.background };

  if (loading) {
    return (
      <View style={[containerStyle, sharedStyles.loader]}>
        <ActivityIndicator size="large" color={themeColors.tint} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[containerStyle, sharedStyles.loader]}>
        <AccessibleText accessibilityLabel={strings.notFound}>
          {strings.notFound}
        </AccessibleText>
      </View>
    );
  }

  return (
    <ScrollView
      style={containerStyle}
      contentContainerStyle={{ padding: Spacing.large }}
    >
      <AccessibleText
        type="h1"
        style={{ color: themeColors.text, marginBottom: Spacing.small }}
        accessibilityLabel={`${commonStrings.titleA11yPrefix}: ${task.title}`}
      >
        {task.title}
      </AccessibleText>

      {task.description && (
        <View style={{ marginBottom: Spacing.medium }}>
          <AccessibleText
            type="caption"
            style={{
              color: themeColors.icon,
              marginBottom: Spacing.small,
              fontSize: 13,
            }}
            accessibilityLabel={strings.descriptionLabel}
          >
            {strings.descriptionLabel}
          </AccessibleText>
          <AccessibleText
            style={{
              color: themeColors.text,
              lineHeight: 22,
              fontSize: 15,
            }}
            accessibilityLabel={task.description}
          >
            {task.description}
          </AccessibleText>
        </View>
      )}

      {task.dueDate && (
        <AccessibleText
          type="caption"
          style={{ color: themeColors.icon, marginBottom: Spacing.medium }}
          accessibilityLabel={`Prazo: ${formatDateLong(new Date(task.dueDate!))}`}
        >
          {strings.dueDateLabel}: {formatDateLong(new Date(task.dueDate!))}
        </AccessibleText>
      )}

      {task.status !== TaskStatus.COMPLETED ? (
        <View style={{ flexDirection: isSmallScreen ? "column" : "row", gap: Spacing.medium, marginTop: Spacing.medium, overflow: "visible", paddingBottom: Spacing.large }}>
          <AccessibleButton
            title={strings.editButton}
            icon={
              <Ionicons
                name="pencil"
                size={20}
                color={themeColors.tint}
              />
            }
            onPress={() => setIsEditModalOpen(true)}
            accessibilityLabel={strings.editButtonA11y}
            textColor={themeColors.tint}
            style={[
              sharedStyles.createButton,
              {
                flex: !isSmallScreen ? 1 : undefined,
                height: 66,
                borderColor: themeColors.tint,
                borderWidth: 1.5,
                backgroundColor: "transparent",
                shadowColor: "transparent",
                shadowOpacity: 0,
                elevation: 0,
              },
            ]}
          />
          <AccessibleButton
            title={strings.completeButton}
            icon={
              <Ionicons
                name="checkmark"
                size={24}
                color={themeColors.buttonText}
              />
            }
            onPress={handleCompleteTask}
            accessibilityLabel={strings.completeButtonA11y}
            style={[sharedStyles.createButton, { flex: !isSmallScreen ? 1 : undefined, height: 66, shadowColor: "transparent", shadowOpacity: 0, elevation: 0, borderWidth: 1.5, borderColor: "transparent" }]}
          />
        </View>
      ) : (
        <AccessibleText
          style={{
            color: themeColors.success,
            textAlign: "center",
            marginTop: Spacing.medium,
          }}
          accessibilityLabel={commonStrings.taskCompletedA11y}
        >
          ✔ {strings.completedTag}
        </AccessibleText>
      )}

      <ConfirmModal
        visible={isOpen}
        title={options?.title ?? ""}
        message={options?.message ?? ""}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        isDestructive={options?.isDangerous}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <EditTaskModal
        visible={isEditModalOpen}
        task={task}
        onClose={handleEditSuccess}
      />
    </ScrollView>
  );
}
