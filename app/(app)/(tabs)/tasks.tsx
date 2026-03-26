import { TaskFilter } from "@/domain/enums/TaskFilter";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { ConfirmModal } from "@/presentation/components/ConfirmModal";
import { TaskCard } from "@/presentation/components/TaskCard";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { FILTER_LABELS } from "@/presentation/utils/filterLabels";
import { filterTasks, sortTasks } from "@/presentation/utils/taskFilters";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [activeFilter, setActiveFilter] = useState<TaskFilter | "ALL">("ALL");
  const router = useRouter();

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    if (completed) {
      await completeTask(taskId);
    } else {
      await uncompleteTask(taskId);
    }
  };

  const { themeColors, preferences } = useTheme();

  const containerStyle = {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: themeColors.background,
  };

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "ALL") return sortTasks(tasks, "date-desc");
    if (activeFilter === TaskFilter.UPCOMING) {
      today.setHours(0, 0, 0, 0);
      const filtered = filterTasks({
        tasks,
        filters: {
          status: [TaskStatus.PENDING],
          dateFrom: today,
          dateTo: nextWeek,
          sortBy: "date-asc",
        },
      });
      return sortTasks(filtered, "date-asc");
    }
    const statusMap: Record<TaskFilter, TaskStatus> = {
      [TaskFilter.PENDING]: TaskStatus.PENDING,
      [TaskFilter.COMPLETED]: TaskStatus.COMPLETED,
      [TaskFilter.UPCOMING]: TaskStatus.PENDING,
    };
    return sortTasks(
      filterTasks({
        tasks,
        filters: {
          status: [statusMap[activeFilter]],
          dateFrom: null,
          dateTo: null,
          sortBy: "date-desc",
        },
      }),
      "date-desc",
    );
  }, [tasks, activeFilter]);

  const FILTERS: Array<{
    key: TaskFilter | "ALL";
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    { key: "ALL", label: "Todas", icon: "list-outline" },
    {
      key: TaskFilter.PENDING,
      label: FILTER_LABELS[TaskFilter.PENDING],
      icon: "time-outline",
    },
    {
      key: TaskFilter.COMPLETED,
      label: FILTER_LABELS[TaskFilter.COMPLETED],
      icon: "checkmark-circle-outline",
    },
    { key: TaskFilter.UPCOMING, label: "Próximas", icon: "calendar-outline" },
  ];

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
    if (preferences.confirmOnComplete && completed) {
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
      // Só atualiza se já houver um usuário autenticado resolvido
      refreshTasks();
    }, [refreshTasks]),
  );

  if (isLoading && tasks.length === 0) {
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

      {/* Barra de filtros */}
      <View style={{ marginTop: Spacing.medium, marginBottom: 4 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: Spacing.small,
          }}
        >
          <Ionicons
            name="funnel-outline"
            size={15}
            color={themeColors.icon}
            accessibilityElementsHidden
          />
          <AccessibleText
            type="caption"
            style={{ color: themeColors.icon, letterSpacing: 0.4 }}
          >
            Filtrar por
          </AccessibleText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.small, paddingBottom: 4 }}
          accessibilityLabel="Filtros de tarefas"
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 7,
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 28,
                  borderWidth: 1.5,
                  borderColor: isActive
                    ? themeColors.tint
                    : themeColors.icon + "40",
                  backgroundColor: isActive
                    ? themeColors.tint
                    : themeColors.background,
                  shadowColor: themeColors.tint,
                  shadowOpacity: isActive ? 0.25 : 0,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: isActive ? 3 : 0,
                }}
                accessibilityLabel={`Filtrar por: ${f.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Ionicons
                  name={f.icon}
                  size={18}
                  color={isActive ? themeColors.buttonText : themeColors.icon}
                  accessibilityElementsHidden
                />
                <AccessibleText
                  style={{
                    color: isActive ? themeColors.buttonText : themeColors.text,
                    fontWeight: isActive ? "700" : "400",
                  }}
                  accessibilityLabel={f.label}
                >
                  {f.label}
                </AccessibleText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ height: 16 }} />
      {filteredTasks.length === 0 ? (
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
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onPress={(taskId) =>
                router.push({
                  pathname: "/task-details",
                  params: { taskId },
                })
              }
            />
          )}
          onRefresh={refreshTasks}
          refreshing={isLoading}
          contentContainerStyle={sharedStyles.list}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Lista de tarefas"
        />
      )}
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
          onPress={() => router.push("/create-task")}
        />
      </View>

      <ConfirmModal
        visible={!!confirmTaskId}
        message="Tem certeza que deseja excluir esta tarefa?"
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ConfirmModal
        visible={!!confirmCompleteTaskId && pendingComplete}
        message="Tem certeza que deseja marcar esta tarefa como concluída?"
        confirmLabel="Concluir"
        cancelLabel="Cancelar"
        onConfirm={confirmComplete}
        onCancel={cancelComplete}
      />
    </View>
  );
}
