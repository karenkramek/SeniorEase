import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { DueDateBadge } from "@/presentation/components/ui/common/DueDateBadge";
import { BaseModal } from "@/presentation/components/ui/modals/BaseModal";
import { ConfirmModal } from "@/presentation/components/ui/modals/ConfirmModal";
import { TaskFormModal } from "@/presentation/components/ui/modals/TaskFormModal";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useButtonHeight } from "@/presentation/hooks/useButtonHeight";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTaskDetails } from "@/presentation/hooks/useTaskDetails";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import {
  formatDateLong,
  formatDateWithTime,
  getDueDateStatus,
} from "@/presentation/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
  const { themeColors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { preferences } = usePreferences();
  const buttonHeight = useButtonHeight();

  const isSmallScreen = windowWidth < 640;
  const shouldStackButtons = isSmallScreen;

  const {
    task,
    loading,
    isEditModalOpen,
    confirmationFlow,
    handleCompleteTask,
    handleEditSuccess: baseHandleEditSuccess,
    openEditModal,
    strings,
    commonStrings,
  } = useTaskDetails({
    taskId,
    enabled: visible,
    onCompleted: () => {
      onTaskCompleted?.();
      onClose();
    },
  });

  const handleEditSuccess = async () => {
    await baseHandleEditSuccess();
    onTaskEdited?.();
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
                gap: 10,
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
                onPress={openEditModal}
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
        visible={confirmationFlow.isOpen}
        title={confirmationFlow.options?.title ?? ""}
        message={confirmationFlow.options?.message ?? ""}
        confirmText={confirmationFlow.options?.confirmText}
        cancelText={confirmationFlow.options?.cancelText}
        isDestructive={confirmationFlow.options?.isDangerous}
        onConfirm={confirmationFlow.handleConfirm}
        onCancel={confirmationFlow.handleCancel}
      />

      <TaskFormModal
        visible={isEditModalOpen}
        task={task}
        onClose={handleEditSuccess}
      />
    </>
  );
}
