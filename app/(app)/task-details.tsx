import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { ConfirmModal } from "@/presentation/components/ConfirmModal";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useConfirmationFlow } from "@/presentation/hooks/useConfirmationFlow";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { formatDateLong } from "@/presentation/utils/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function TaskDetailsScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.taskDetails;
  const commonStrings = appTexts.common;
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { themeColors } = useTheme();
  const { preferences } = usePreferences();

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
              message: strings.completeSuccess,
              description: strings.congratsTitle,
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
          message: strings.completeSuccess,
          description: strings.congratsTitle,
          duration: 6000,
        });
        setTimeout(() => router.back(), 1000);
      } catch (_error) {
        console.log(_error);
        showError(strings.completeError);
      }
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
        <AccessibleText accessibilityLabel={strings.notFoundA11y}>
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
        accessibilityLabel={`Título: ${task.title}`}
      >
        {task.title}
      </AccessibleText>

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
        <View style={{ alignItems: "center", marginTop: Spacing.medium }}>
          <AccessibleButton
            title={strings.completeButton}
            onPress={handleCompleteTask}
            accessibilityLabel={strings.completeButtonA11y}
            style={sharedStyles.createButton}
          />
        </View>
      ) : (
        <AccessibleText
          style={{
            color: themeColors.success,
            textAlign: "center",
            marginTop: Spacing.medium,
          }}
          accessibilityLabel={strings.completedTagA11y}
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
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ScrollView>
  );
}
