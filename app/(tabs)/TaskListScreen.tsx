import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { ConfirmModal } from "@/presentation/components/ConfirmModal";
import { TaskCard } from "@/presentation/components/TaskCard";
import { useNotification } from "@/presentation/hooks/useNotification";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTasks } from "@/presentation/hooks/useTasks";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function TaskListScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.taskList;
  const {
    tasks,
    isLoading,
    refreshTasks,
    completeTask,
    uncompleteTask,
    deleteTask,
  } = useTasks();
  const [confirmTaskId, setConfirmTaskId] = useState<string | null>(null);
  const [confirmCompleteTaskId, setConfirmCompleteTaskId] = useState<
    string | null
  >(null);
  const [pendingComplete, setPendingComplete] = useState<boolean>(false);
  const newTaskButtonRef = React.useRef<any>(null);
  const { showNotification } = useNotification();
  const router = useRouter();

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      if (completed) {
        await completeTask(taskId);
      } else {
        await uncompleteTask(taskId);
      }
      showNotification(
        completed ? strings.taskCompleted : strings.taskReopened,
        "success",
      );
    } catch (error) {
      console.error("Falha ao atualizar tarefa", error);
      showNotification(strings.taskUpdateError, "error");
    }

    await refreshTasks();
  };

  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  const containerStyle = {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: themeColors.background,
  };

  const handleDelete = async (taskId: string) => {
    if (preferences.useExtraConfirmation) {
      setConfirmTaskId(taskId);
    } else {
      try {
        await deleteTask(taskId);
        showNotification(strings.taskDeleted, "success");
      } catch (error) {
        console.error("Falha ao excluir tarefa", error);
        showNotification(strings.taskDeleteError, "error");
      }
    }
  };

  const confirmDelete = async () => {
    if (confirmTaskId) {
      try {
        await deleteTask(confirmTaskId);
        showNotification(strings.taskDeleted, "success");
      } catch (error) {
        console.error("Falha ao excluir tarefa", error);
        showNotification(strings.taskDeleteError, "error");
      }
      setConfirmTaskId(null);
    }
  };

  const cancelDelete = () => setConfirmTaskId(null);

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    if (preferences.useExtraConfirmation && completed) {
      setConfirmCompleteTaskId(taskId);
      setPendingComplete(true);
    } else {
      toggleTaskStatus(taskId, completed);
    }
  };

  const confirmComplete = async () => {
    if (confirmCompleteTaskId) {
      await toggleTaskStatus(confirmCompleteTaskId, true);
      setConfirmCompleteTaskId(null);
      setPendingComplete(false);
    }
  };

  const cancelComplete = () => {
    setConfirmCompleteTaskId(null);
    setPendingComplete(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshTasks();
    }, [refreshTasks]),
  );

  if (isLoading) {
    return (
      <View style={[containerStyle, sharedStyles.loader]}>
        <ActivityIndicator size="large" color={themeColors.tint} />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={sharedStyles.titleContainer}>
        <AccessibleText type="h1" style={{ textAlign: "center" }}>
          {strings.screenTitle}
        </AccessibleText>
      </View>
      {/* Espaço após o título */}
      <View style={{ height: 16 }} />
      {/* Lista de tarefas */}
      {tasks.length === 0 ? (
        <View style={sharedStyles.emptyContainer}>
          <AccessibleText accessibilityLabel={strings.noTasks}>
            {strings.noTasks}
          </AccessibleText>
          <AccessibleText type="caption" accessibilityLabel={strings.noTasksHintA11y}>
            {strings.noTasksHint}
          </AccessibleText>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          )}
          onRefresh={refreshTasks}
          refreshing={isLoading}
          contentContainerStyle={sharedStyles.list}
          showsVerticalScrollIndicator={false}
          accessibilityLabel={strings.listLabel}
        />
      )}
      {/* Botão sempre no rodapé, com espaçamento */}
      <View style={{ marginTop: 24, marginBottom: 8, alignItems: "center" }}>
        <AccessibleButton
          ref={newTaskButtonRef}
          title={strings.newTaskButton}
          icon={
            <MaterialIcons
              name="add"
              size={32}
              color="#fff"
              accessibilityLabel={strings.addIconA11y}
            />
          }
          style={sharedStyles.createButton}
          accessibilityLabel={strings.newTaskButtonA11y}
          onPress={() => router.push("/CreateTaskScreen")}
        />
      </View>

      <ConfirmModal
        visible={!!confirmTaskId}
        title={strings.confirmDeleteTitle}
        message={strings.confirmDeleteMessage}
        confirmText={strings.confirmDeleteAction}
        cancelText={appTexts.common.cancel}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        restoreFocusRef={newTaskButtonRef}
      />

      <ConfirmModal
        visible={!!confirmCompleteTaskId && pendingComplete}
        title={strings.confirmCompleteTitle}
        message={strings.confirmCompleteMessage}
        confirmText={strings.confirmCompleteAction}
        cancelText={appTexts.common.cancel}
        onConfirm={confirmComplete}
        onCancel={cancelComplete}
        restoreFocusRef={newTaskButtonRef}
      />
    </View>
  );
}
