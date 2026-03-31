import { TaskFilter } from "@/domain/enums/TaskFilter";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { ConfirmModal } from "@/presentation/components/ConfirmModal";
import { CreateTaskModal } from "@/presentation/components/CreateTaskModal";
import { TaskCard } from "@/presentation/components/TaskCard";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTasks } from "@/presentation/hooks/useTasks";
import { useTheme } from "@/presentation/hooks/useTheme";
import { getWebContentShellStyle } from "@/presentation/theme/platformLayout";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
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
  const [activeFilter, setActiveFilter] = useState<TaskFilter | "ALL">("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    if (completed) {
      await completeTask(taskId);
    } else {
      await uncompleteTask(taskId);
    }
  };

  const { themeColors, preferences, isWeb } = useTheme();

  const outerScreenStyle = {
    flex: 1,
    width: "100%" as const,
    backgroundColor: themeColors.background,
  };
  const contentColumnStyle = {
    flex: 1,
    padding: Spacing.medium,
    ...getWebContentShellStyle(),
  };

  const filteredTasks = useMemo(() => {
    if (activeFilter === "ALL") return sortTasks(tasks, "date-desc");
    if (activeFilter === TaskFilter.UPCOMING) {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
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

  const FILTERS: {
    key: TaskFilter | "ALL";
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: "ALL", label: strings.allFilterLabel, icon: "list-outline" },
    {
      key: TaskFilter.PENDING,
      label: strings.pendingFilterLabel,
      icon: "time-outline",
    },
    {
      key: TaskFilter.COMPLETED,
      label: strings.completedFilterLabel,
      icon: "checkmark-circle-outline",
    },
    {
      key: TaskFilter.UPCOMING,
      label: strings.upcomingFilterLabel,
      icon: "calendar-outline",
    },
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
      <View style={outerScreenStyle}>
        <View style={[contentColumnStyle, sharedStyles.loader]}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      </View>
    );
  }

  return (
    <View style={outerScreenStyle}>
      <View style={contentColumnStyle}>
      <View style={sharedStyles.titleContainer}>
        <AccessibleText type="h1" style={{ textAlign: "center" }}>
          {strings.screenTitle}
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
            size={isWeb ? 18 : 15}
            color={themeColors.icon}
            accessibilityElementsHidden
          />
          <AccessibleText
            type="caption"
            style={{ color: themeColors.icon, letterSpacing: 0.4 }}
          >
            {strings.filterByLabel}
          </AccessibleText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.small, paddingBottom: 4 }}
          accessibilityLabel={strings.filtersA11y}
          style={{ backgroundColor: "transparent" }}
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
                accessibilityLabel={`${strings.filterByPrefixA11y}: ${f.label}`}
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
          <AccessibleText accessibilityLabel={strings.noTasks}>
            {strings.noTasks}
          </AccessibleText>
          <AccessibleText type="caption" accessibilityLabel={strings.noTasksHintA11y}>
            {strings.noTasksHint}
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
          accessibilityLabel={strings.listLabel}
        />
      )}
      <View style={{ marginTop: 24, marginBottom: 8, alignItems: "center" }}>
        <AccessibleButton
          title={strings.newTaskButton}
          icon={
            <MaterialIcons
              name="add"
              size={32}
              color={themeColors.buttonText}
              accessibilityLabel={strings.addIconA11y}
            />
          }
          style={sharedStyles.createButton}
          accessibilityLabel={strings.newTaskButtonA11y}
          onPress={() => {
            if (isWeb) {
              setIsCreateModalOpen(true);
            } else {
              router.push("/create-task");
            }
          }}
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
      />

      <ConfirmModal
        visible={!!confirmCompleteTaskId && pendingComplete}
        title={strings.confirmCompleteTitle}
        message={strings.confirmCompleteMessage}
        confirmText={strings.confirmCompleteAction}
        cancelText={appTexts.common.cancel}
        onConfirm={confirmComplete}
        onCancel={cancelComplete}
      />

      <CreateTaskModal
        visible={isCreateModalOpen && isWeb}
        onClose={() => setIsCreateModalOpen(false)}
      />
      </View>
    </View>
  );
}
