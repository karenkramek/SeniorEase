import { TaskFilter } from "@/domain/enums/TaskFilter";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { TaskCard } from "@/presentation/components/task/TaskCard";
import { AccessibleButton } from "@/presentation/components/ui/buttons/AccessibleButton";
import { ConfirmModal } from "@/presentation/components/ui/modals/ConfirmModal";
import { TaskDetailsModal } from "@/presentation/components/ui/modals/TaskDetailsModal";
import { TaskFormModal } from "@/presentation/components/ui/modals/TaskFormModal";
import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useButtonHeight } from "@/presentation/hooks/useButtonHeight";
import { useConfirmationFlow } from "@/presentation/hooks/useConfirmationFlow";
import { useTaskActions } from "@/presentation/hooks/useTaskActions";
import { useTaskList } from "@/presentation/hooks/useTaskList";
import { useTheme } from "@/presentation/hooks/useTheme";
import { isWebCompactViewport } from "@/presentation/theme/breakpoints";
import { getWebContentShellStyle } from "@/presentation/theme/platformLayout";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { filterTasks, sortTasks } from "@/presentation/utils/taskFilters";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function TaskListScreen() {
  const appTexts = useAppStrings();
  const strings = appTexts.taskList;
  const { height: screenHeight } = useWindowDimensions();
  const router = useRouter();
  const { themeColors, preferences, isWeb } = useTheme();
  const buttonHeight = useButtonHeight();
  const { tasks, isLoading, refreshTasks } = useTaskList();
  const { completeTask, uncompleteTask, deleteTask } =
    useTaskActions(refreshTasks);

  const {
    isOpen,
    options,
    handleConfirm,
    handleCancel,
    showConfirmation,
    showSuccess,
    showError,
  } = useConfirmationFlow();

  const [activeFilter, setActiveFilter] = React.useState<TaskFilter | "ALL">(
    "ALL",
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [taskDetailsModalId, setTaskDetailsModalId] = React.useState<
    string | null
  >(null);

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    if (completed) {
      await completeTask(taskId);
    } else {
      await uncompleteTask(taskId);
    }
  };

  const handleDelete = (taskId: string) => {
    if (preferences.useExtraConfirmation) {
      showConfirmation({
        title: strings.confirmDeleteTitle,
        message: strings.confirmDeleteMessage,
        confirmText: appTexts.common.deleteAction,
        cancelText: appTexts.common.cancel,
        iconName: "trash",
        isDangerous: true,
        onConfirm: async () => {
          try {
            await deleteTask(taskId);
            showSuccess({
              message: strings.taskDeleted,
              duration: 6000,
            });
          } catch (_error) {
            console.log(_error);
            showError(strings.taskDeleteError);
          }
        },
      });
    } else {
      deleteTask(taskId);
      showSuccess({
        message: strings.taskDeleted,
        duration: 6000,
      });
    }
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    if (preferences.confirmOnComplete && completed) {
      showConfirmation({
        title: appTexts.taskList.confirmCompleteTitle,
        message: appTexts.taskList.confirmCompleteMessage,
        confirmText: appTexts.taskList.confirmCompleteAction,
        cancelText: appTexts.common.cancel,
        iconName: "checkmark-circle",
        onConfirm: async () => {
          try {
            await toggleTaskStatus(taskId, completed);
            showSuccess({
              message: strings.taskCompleted,
              duration: 6000,
            });
          } catch (_error) {
            console.log(_error);
            showError(strings.taskUpdateError);
          }
        },
      });
    } else {
      toggleTaskStatus(taskId, completed);
      if (completed) {
        showSuccess({
          message: strings.taskCompleted,
          duration: 5000,
        });
      }
    }
  };

  const filteredTasks = useMemo(() => {
    if (activeFilter === "ALL") return sortTasks(tasks, "date-desc");
    if (activeFilter === TaskFilter.UPCOMING) {
      const today = new Date();
      const next10Days = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
      today.setHours(0, 0, 0, 0);
      const filtered = filterTasks({
        tasks,
        filters: {
          status: [TaskStatus.PENDING],
          dateFrom: today,
          dateTo: next10Days,
          sortBy: "date-asc",
        },
      });
      return sortTasks(filtered, "date-asc");
    }
    if (activeFilter === TaskFilter.OVERDUE) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filtered = tasks.filter((t) => {
        if (t.status === TaskStatus.COMPLETED) return false;
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today;
      });
      return sortTasks(filtered, "date-asc");
    }
    const statusMap: Record<TaskFilter, TaskStatus> = {
      [TaskFilter.PENDING]: TaskStatus.PENDING,
      [TaskFilter.COMPLETED]: TaskStatus.COMPLETED,
      [TaskFilter.UPCOMING]: TaskStatus.PENDING,
      [TaskFilter.OVERDUE]: TaskStatus.PENDING,
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
    {
      key: TaskFilter.OVERDUE,
      label: strings.overdueFilterLabel,
      icon: "alert-circle-outline",
    },
  ];

  const outerScreenStyle = {
    flex: 1,
    width: "100%" as const,
    backgroundColor: themeColors.background,
  };
  const contentColumnStyle = {
    flex: 1,
    padding: isWebCompactViewport(isWeb, screenHeight)
      ? Spacing.small
      : Spacing.medium,
    paddingTop: isWebCompactViewport(isWeb, screenHeight)
      ? Spacing.small
      : Spacing.medium,
    ...getWebContentShellStyle(),
  };
  const isNativeMobile = Platform.OS !== "web";
  const isCompactWeb = isWebCompactViewport(isWeb, screenHeight);
  const showFixedWebCreateButton = isWeb && !isCompactWeb;

  const renderCreateButton = (insideFixedBar = false) => (
    <View
      style={{
        marginTop: insideFixedBar ? 0 : isCompactWeb ? Spacing.small : 5,
        marginBottom: insideFixedBar ? 0 : isNativeMobile ? 5 : 5,
        alignItems: "center",
        width: "100%",
      }}
    >
      <AccessibleButton
        title={appTexts.navigation.createTaskHeaderTitle}
        icon={
          <MaterialIcons
            name="add"
            size={32}
            color={themeColors.buttonText}
            accessibilityLabel={strings.addIconA11y}
          />
        }
        style={[
          sharedStyles.createButton,
          {
            height: buttonHeight,
            ...(isNativeMobile || isCompactWeb
              ? {
                  width: "100%",
                  minWidth: 0,
                  maxWidth: "100%",
                }
              : {}),
          },
        ]}
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
  );

  return (
    <View style={outerScreenStyle}>
      <View style={contentColumnStyle}>
        {!isCompactWeb && (
          <View style={sharedStyles.titleContainer}>
            <AccessibleText
              type="h1"
              style={{
                textAlign: "center",
                fontSize: preferences.fontSizeMultiplier === 1 ? 24 : 32,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              {appTexts.navigation.tasksTabTitle}
            </AccessibleText>
          </View>
        )}

        <View
          style={{
            marginTop: isCompactWeb ? Spacing.small : Spacing.medium,
            marginBottom: isCompactWeb ? 2 : 4,
          }}
        >
          {!isCompactWeb && (
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
          )}

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
                    gap: isCompactWeb ? 5 : 7,
                    paddingVertical: isCompactWeb ? 8 : 10,
                    paddingHorizontal: isCompactWeb ? 12 : 18,
                    borderRadius: 12,
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
                  accessibilityLabel={`${strings.filterByLabel}: ${f.label}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Ionicons
                    name={f.icon}
                    size={isCompactWeb ? 16 : 18}
                    color={isActive ? themeColors.buttonText : themeColors.icon}
                    accessibilityElementsHidden
                  />
                  <AccessibleText
                    style={{
                      color: isActive
                        ? themeColors.buttonText
                        : themeColors.text,
                      fontWeight: isActive ? "700" : "400",
                      fontSize:
                        (isCompactWeb ? 13 : 14) *
                        preferences.fontSizeMultiplier,
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
        <View style={{ flex: 1, minHeight: 0 }}>
          {filteredTasks.length === 0 ? (
            <View style={sharedStyles.emptyContainer}>
              <AccessibleText accessibilityLabel={strings.noTasks}>
                {strings.noTasks}
              </AccessibleText>
              {isCompactWeb && renderCreateButton()}
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
                  onPress={(taskId) => {
                    if (isWeb) {
                      setTaskDetailsModalId(taskId);
                    } else {
                      router.push({
                        pathname: "/task-details",
                        params: { taskId },
                      });
                    }
                  }}
                />
              )}
              style={{ flex: 1, minHeight: 0 }}
              onRefresh={refreshTasks}
              refreshing={isLoading}
              contentContainerStyle={[
                sharedStyles.list,
                {
                  paddingBottom: showFixedWebCreateButton
                    ? buttonHeight + Spacing.xlarge
                    : 8,
                },
              ]}
              showsVerticalScrollIndicator={false}
              accessibilityLabel={strings.listLabel}
            />
          )}
        </View>

        {isNativeMobile && renderCreateButton()}

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
          visible={isCreateModalOpen && isWeb}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => refreshTasks()}
        />

        <TaskDetailsModal
          visible={isWeb && !!taskDetailsModalId}
          taskId={taskDetailsModalId}
          onClose={() => setTaskDetailsModalId(null)}
          onTaskCompleted={() => refreshTasks()}
          onTaskEdited={() => refreshTasks()}
        />
      </View>

      {showFixedWebCreateButton && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: themeColors.background,
            borderTopWidth: 1,
            borderTopColor: themeColors.icon + "30",
            paddingHorizontal: Spacing.medium,
            paddingTop: Spacing.small,
            paddingBottom: Spacing.small,
          }}
          pointerEvents="box-none"
        >
          <View
            style={{
              ...getWebContentShellStyle(),
            }}
          >
            {renderCreateButton(true)}
          </View>
        </View>
      )}
    </View>
  );
}
