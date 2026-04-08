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
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
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
  const { themeColors, isWeb } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { preferences } = usePreferences();

  // Web mobile: < 640px (sm breakpoint)
  const isWebMobile = isWeb && windowWidth < 640;
  // Responsive: Mobile < 640px (stacked), Tablet+ >= 640px (side-by-side)
  const buttonLayoutIsRow = windowWidth >= 640;

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
      if (!taskId || !visible) {
        setTask(null);
        setLoading(false);
        return;
      }
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
    // Recarregar os dados da tarefa
    if (taskId) {
      const updated = await taskRepository.findById(taskId);
      setTask(updated);
    // Chamar callback para atualizar a lista principal
    onTaskEdited?.();
    }
  };

  if (loading) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
        accessibilityViewIsModal
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.background,
              borderRadius: 12,
              width: "100%",
              maxWidth: 600,
              padding: Spacing.large,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={themeColors.tint} />
          </View>
        </View>
      </Modal>
    );
  }

  if (!task) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
        accessibilityViewIsModal
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.background,
              borderRadius: 12,
              width: "100%",
              maxWidth: 600,
              padding: Spacing.large,
            }}
          >
            <AccessibleText
              accessibilityLabel={strings.notFound}
              style={{ color: themeColors.text, textAlign: "center" }}
            >
              {strings.notFound}
            </AccessibleText>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.background,
            borderRadius: 12,
            maxHeight: "90%",
            width: "100%",
            maxWidth: 600,
            flexDirection: "column",
          }}
        >
          {/* Header do Modal */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.icon + "20",
              gap: 12,
            }}
          >
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.text,
                flex: 1,
                fontSize: isWebMobile ? 18 : 20,
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

          {/* Conteúdo */}
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 32,
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
                    fontSize: isWebMobile ? 12 : 13,
                  }}
                  accessibilityLabel={strings.descriptionLabel}
                >
                  {strings.descriptionLabel}
                </AccessibleText>
                <AccessibleText
                  style={{
                    color: themeColors.text,
                    lineHeight: 22,
                    fontSize: isWebMobile ? 14 : 15,
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
                    fontSize: isWebMobile ? 12 : 13,
                  }}
                  accessibilityLabel={strings.dueDateLabel}
                >
                  {strings.dueDateLabel}
                </AccessibleText>
                <AccessibleText
                  style={{
                    color: themeColors.text,
                    fontSize: isWebMobile ? 14 : 15,
                  }}
                  accessibilityLabel={formatDateLong(new Date(task.dueDate!))}
                >
                  {formatDateLong(new Date(task.dueDate!))}
                </AccessibleText>
              </View>
            )}

            <View style={{ marginTop: Spacing.large }}>
              {task.status !== TaskStatus.COMPLETED ? (
                <View style={{ flexDirection: buttonLayoutIsRow ? "row" : "column", gap: Spacing.medium, overflow: "visible" }}>
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
                        flex: buttonLayoutIsRow ? 1 : undefined,
                        height: 66,
                        borderColor: themeColors.tint,
                        borderWidth: 1.5,
                        backgroundColor: "transparent",
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
                    style={[sharedStyles.createButton, { flex: buttonLayoutIsRow ? 1 : undefined, height: 66, borderWidth: 1.5, borderColor: "transparent" }]}
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
        </View>
      </View>

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
    </Modal>
  );
}
