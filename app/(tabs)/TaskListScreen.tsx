import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { TaskCard } from "@/presentation/components/TaskCard";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useTasks } from "@/presentation/hooks/useTasks";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";

export default function TaskListScreen() {
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
  const router = useRouter();

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    if (completed) {
      await completeTask(taskId);
    } else {
      await uncompleteTask(taskId);
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

  const handleDelete = (taskId: string) => {
    if (preferences.useExtraConfirmation) {
      setConfirmTaskId(taskId);
    } else {
      deleteTask(taskId);
    }
  };

  const confirmDelete = () => {
    if (confirmTaskId) {
      deleteTask(confirmTaskId);
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

  const confirmComplete = () => {
    if (confirmCompleteTaskId) {
      toggleTaskStatus(confirmCompleteTaskId, true);
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
          Tarefas
        </AccessibleText>
      </View>
      {/* Espaço após o título */}
      <View style={{ height: 16 }} />
      {/* Lista de tarefas */}
      {tasks.length === 0 ? (
        <View style={sharedStyles.emptyContainer}>
          <AccessibleText accessibilityLabel="Nenhuma tarefa encontrada">
            Nenhuma tarefa encontrada.
          </AccessibleText>
          <AccessibleText
            type="caption"
            accessibilityLabel="Crie uma nova tarefa para começar"
          >
            Crie uma nova tarefa para começar!
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
          accessibilityLabel="Lista de tarefas"
        />
      )}
      {/* Botão sempre no rodapé, com espaçamento */}
      <View style={{ marginTop: 24, marginBottom: 8, alignItems: "center" }}>
        <AccessibleButton
          title="Nova Tarefa"
          icon={
            <MaterialIcons
              name="add"
              size={32}
              color="#fff"
              accessibilityLabel="Ícone de adicionar"
            />
          }
          style={sharedStyles.createButton}
          accessibilityLabel="Botão para criar nova tarefa"
          onPress={() => router.push("/CreateTaskScreen")}
        />
      </View>

      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={!!confirmTaskId}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
        accessibilityViewIsModal={true}
      >
        <View
          style={[
            sharedStyles.container,
            { backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" },
          ]}
        >
          <View
            style={{
              backgroundColor: themeColors.background,
              padding: 24,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <AccessibleText style={{ fontSize: 18, marginBottom: 16 }}>
              Tem certeza que deseja excluir esta tarefa?
            </AccessibleText>
            <AccessibleButton
              title="Excluir"
              onPress={confirmDelete}
              style={{ marginBottom: 8 }}
              accessibilityLabel="Confirmar exclusão"
            />
            <AccessibleButton
              title="Cancelar"
              onPress={cancelDelete}
              accessibilityLabel="Cancelar exclusão"
            />
          </View>
        </View>
      </Modal>
      {/* Modal de confirmação ao completar */}
      <Modal
        visible={!!confirmCompleteTaskId && pendingComplete}
        transparent
        animationType="fade"
        onRequestClose={cancelComplete}
        accessibilityViewIsModal={true}
      >
        <View
          style={[
            sharedStyles.container,
            { backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" },
          ]}
        >
          <View
            style={{
              backgroundColor: themeColors.background,
              padding: 24,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <AccessibleText style={{ fontSize: 18, marginBottom: 16 }}>
              Tem certeza que deseja marcar esta tarefa como concluída?
            </AccessibleText>
            <AccessibleButton
              title="Concluir"
              onPress={confirmComplete}
              style={{ marginBottom: 8 }}
              accessibilityLabel="Confirmar conclusão"
            />
            <AccessibleButton
              title="Cancelar"
              onPress={cancelComplete}
              accessibilityLabel="Cancelar conclusão"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
