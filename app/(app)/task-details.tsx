import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { DueDateBadge } from "@/presentation/components/ui/common/DueDateBadge";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { themeColors } = useTheme();
  const { preferences } = usePreferences();
  const buttonHeight = useButtonHeight();

  const {
    task,
    loading,
    isEditModalOpen,
    confirmationFlow,
    handleCompleteTask,
    handleEditSuccess,
    openEditModal,
    strings,
    commonStrings,
  } = useTaskDetails({
    taskId: taskId ?? null,
    onCompleted: () => router.back(),
  });

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
              fontSize: 13 * preferences.fontSizeMultiplier,
            }}
            accessibilityLabel={strings.descriptionLabel}
          >
            {strings.descriptionLabel}
          </AccessibleText>
          <AccessibleText
            style={{
              color: themeColors.text,
              lineHeight: 22 * preferences.fontSizeMultiplier,
              fontSize: 15 * preferences.fontSizeMultiplier,
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
              marginBottom: 4,
              fontSize: 13 * preferences.fontSizeMultiplier,
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
                fontSize: 15 * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel={`${strings.dueDateLabel}: ${formatDateLong(new Date(task.dueDate!))}`}
            >
              {formatDateLong(new Date(task.dueDate!))}
            </AccessibleText>
            {task.status !== TaskStatus.COMPLETED && (
              <DueDateBadge status={getDueDateStatus(task.dueDate)} size="md" />
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
              marginBottom: 4,
              fontSize: 13 * preferences.fontSizeMultiplier,
            }}
            accessibilityLabel="Data de criação da tarefa"
          >
            Data de Criação
          </AccessibleText>
          <AccessibleText
            style={{
              color: themeColors.text,
              fontSize: 15 * preferences.fontSizeMultiplier,
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
                fontSize: 13 * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel="Data de conclusão da tarefa"
            >
              Data de Conclusão
            </AccessibleText>
            <AccessibleText
              style={{
                color: themeColors.text,
                fontSize: 15 * preferences.fontSizeMultiplier,
              }}
              accessibilityLabel={`Concluída em: ${formatDateWithTime(new Date(task.completedAt || task.updatedAt))}`}
            >
              {formatDateWithTime(new Date(task.completedAt || task.updatedAt))}
            </AccessibleText>
          </View>
        )}

      {task.status !== TaskStatus.COMPLETED ? (
        <View
          style={{
            flexDirection: "column",
            gap: Spacing.medium,
            marginTop: Spacing.medium,
            overflow: "visible",
            paddingBottom: Spacing.large,
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%",
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
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                alignSelf: "stretch",
              },
            ]}
          />
          <AccessibleButton
            title={strings.editButton}
            icon={<Ionicons name="pencil" size={20} color={themeColors.tint} />}
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
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                alignSelf: "stretch",
              },
            ]}
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
    </ScrollView>
  );
}
