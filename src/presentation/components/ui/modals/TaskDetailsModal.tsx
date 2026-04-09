import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { DueDateBadge } from "@/presentation/components/ui/common/DueDateBadge";
import { BaseModal } from "@/presentation/components/ui/modals/BaseModal";
import { ConfirmModal } from "@/presentation/components/ui/modals/ConfirmModal";
import { TaskFormModal } from "@/presentation/components/ui/modals/TaskFormModal";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useButtonHeight } from "@/presentation/hooks/useButtonHeight";
import { useConfirmationFlow } from "@/presentation/hooks/useConfirmationFlow";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import {
  formatDateLong,
  formatDateWithTime,
  getDueDateStatus,
} from "@/presentation/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface TaskDetailsModalProps {
  visible: boolean;
  taskId: string | null;
  onClose: () => void;
  onTaskCompleted?: () => void;
  onTaskEdited?: () => void;
}

export function TaskDetailsModal({
  visible,
  taskId,
  onClose,
  onTaskCompleted,
  onTaskEdited,
}: TaskDetailsModalProps) {
  const appTexts = useAppStrings();
  const strings = appTexts.taskDetails;
  const commonStrings = appTexts.common;
  const { themeColors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { preferences } = usePreferences();
  const buttonHeight = useButtonHeight();

  // Responsive: < 640px (sm breakpoint) — modal é web-only
  const isSmallScreen = windowWidth < 640;
  const shouldStackButtons = isSmallScreen;

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
    if (!visible || !taskId) return;
    const load = async () => {
      setLoading(true);
      const found = await taskRepository.findById(taskId);
      setTask(found);
      setLoading(false);
    };
    load();
  }, [taskId, visible, taskRepository]);

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
            setTimeout(() => {
              onTaskCompleted?.();
              onClose();
            }, 1000);
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
        setTimeout(() => {
          onTaskCompleted?.();
          onClose();
        }, 1000);
      } catch (_error) {
        console.log(_error);
        showError(strings.completeError);
      }
    }
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    if (taskId) {
      const updated = await taskRepository.findById(taskId);
      setTask(updated);
      onTaskEdited?.();
    }
  };

  const header = task ? (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <AccessibleText
        type="h2"
        style={{
          color: themeColors.text,
          flex: 1,
          fontSize: (isSmallScreen ? 18 : 20) * preferences.fontSizeMultiplier,
        }}
        accessibilityLabel={`Título: ${task.title}`}
      >
        {task.title}
      </AccessibleText>

      <TouchableOpacity
        onPress={onClose}
        accessible
        accessibilityRole="button"
        accessibilityLabel={commonStrings.close}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        style={{ minWidth: 24, minHeight: 24 }}
      >
        <Ionicons
          name="close"
          size={24}
          color={themeColors.icon}
          accessibilityElementsHidden
        />
      </TouchableOpacity>
    </View>
  ) : undefined;

  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ alignItems: "center", padding: Spacing.large }}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      );
    }

    if (!task) {
      return (
        <AccessibleText
          accessibilityLabel={strings.notFound}
          style={{ color: themeColors.text, textAlign: "center" }}
        >
          {strings.notFound}
        </AccessibleText>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {task.description && (
          <View style={{ marginBottom: Spacing.medium }}>
            <AccessibleText
              type="caption"
              style={{
                color: themeColors.icon,
                marginBottom: Spacing.small,
                fontSize:
                  (isSmallScreen ? 12 : 13) * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel={strings.descriptionLabel}
            >
              {strings.descriptionLabel}
            </AccessibleText>
            <AccessibleText
              style={{
                color: themeColors.text,
                lineHeight: 22 * preferences.fontSizeMultiplier,
                fontSize:
                  (isSmallScreen ? 14 : 15) * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel={task.description}
            >
              {task.description}
            </AccessibleText>
          </View>
        )}

        {task.dueDate && (
          <View style={{ marginBottom: Spacing.medium }}>
            <AccessibleText
              type="caption"
              style={{
                color: themeColors.icon,
                marginBottom: Spacing.small,
                fontSize:
                  (isSmallScreen ? 12 : 13) * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel={strings.dueDateLabel}
            >
              {strings.dueDateLabel}
            </AccessibleText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <AccessibleText
                style={{
                  color: themeColors.text,
                  fontSize:
                    (isSmallScreen ? 14 : 15) * preferences.fontSizeMultiplier,
                }}
                accessibilityLabel={formatDateLong(new Date(task.dueDate!))}
              >
                {formatDateLong(new Date(task.dueDate!))}
              </AccessibleText>
              {task.status !== TaskStatus.COMPLETED && (
                <DueDateBadge
                  status={getDueDateStatus(task.dueDate)}
                  size="md"
                />
              )}
            </View>
          </View>
        )}

        {task.createdAt && (
          <View style={{ marginBottom: Spacing.medium }}>
            <AccessibleText
              type="caption"
              style={{
                color: themeColors.icon,
                marginBottom: Spacing.small,
                fontSize:
                  (isSmallScreen ? 12 : 13) * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel="Data de criação da tarefa"
            >
              Data de Criação
            </AccessibleText>
            <AccessibleText
              style={{
                color: themeColors.text,
                fontSize:
                  (isSmallScreen ? 14 : 15) * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel={`Criada em: ${formatDateWithTime(new Date(task.createdAt))}`}
            >
              {formatDateWithTime(new Date(task.createdAt))}
            </AccessibleText>
          </View>
        )}

        {task.status === TaskStatus.COMPLETED &&
          (task.completedAt || task.updatedAt) && (
            <View style={{ marginBottom: Spacing.medium }}>
              <AccessibleText
                type="caption"
                style={{
                  color: themeColors.icon,
                  marginBottom: 4,
                  fontSize:
                    (isSmallScreen ? 12 : 13) * preferences.fontSizeMultiplier,
                }}
                accessibilityLabel="Data de conclusão da tarefa"
              >
                Data de Conclusão
              </AccessibleText>
              <AccessibleText
                style={{
                  color: themeColors.text,
                  fontSize:
                    (isSmallScreen ? 14 : 15) * preferences.fontSizeMultiplier,
                }}
                accessibilityLabel={`Concluída em: ${formatDateWithTime(new Date(task.completedAt || task.updatedAt))}`}
              >
                {formatDateWithTime(
                  new Date(task.completedAt || task.updatedAt),
                )}
              </AccessibleText>
            </View>
          )}

        <View style={{ marginTop: Spacing.large }}>
          {task.status !== TaskStatus.COMPLETED ? (
            <View
              style={{
                flexDirection: shouldStackButtons ? "column" : "row",
                gap: Spacing.medium,
                overflow: "visible",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: "auto",
              }}
            >
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
                style={[
                  sharedStyles.createButton,
                  {
                    height: buttonHeight,
                    borderWidth: 1.5,
                    borderColor: "transparent",
                  },
                ]}
              />
              <AccessibleButton
                title={strings.editButton}
                icon={
                  <Ionicons name="pencil" size={20} color={themeColors.tint} />
                }
                onPress={() => setIsEditModalOpen(true)}
                accessibilityLabel={strings.editButtonA11y}
                textColor={themeColors.tint}
                style={[
                  sharedStyles.createButton,
                  {
                    height: buttonHeight,
                    borderColor: themeColors.tint,
                    borderWidth: 1.5,
                    backgroundColor: "transparent",
                  },
                ]}
              />
            </View>
          ) : (
            <AccessibleText
              style={{
                color: themeColors.success,
                textAlign: "center",
              }}
              accessibilityLabel={commonStrings.taskCompletedA11y}
            >
              ✔ {strings.completedTag}
            </AccessibleText>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <BaseModal
        visible={visible}
        onClose={onClose}
        header={header}
        maxWidth={600}
      >
        {renderContent()}
      </BaseModal>

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

      <TaskFormModal
        visible={isEditModalOpen}
        task={task}
        onClose={handleEditSuccess}
      />
    </>
  );
}
