import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { formatDateRelative, getDueDateStatus } from "@/presentation/utils/format";
import { DueDateBadge } from "@/presentation/components/DueDateBadge";
import { truncateText } from "@/presentation/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, TouchableOpacity, View, useWindowDimensions } from "react-native";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onPress?: (taskId: string) => void;
}

export function TaskCard({
  task,
  onDelete,
  onToggleComplete,
  onPress,
}: TaskCardProps) {
  const appTexts = useAppStrings();
  const taskCardTexts = appTexts.taskCard;
  const { themeColors, preferences, isWeb } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  // Web mobile: < 640px (sm breakpoint)
  const isWebMobile = isWeb && windowWidth < 640;

  const cardStyle = {
    backgroundColor: themeColors.background,
    padding: Spacing.medium * preferences.spacingMultiplier,
    borderRadius: 12,
    marginBottom: Spacing.medium,
    borderWidth: isWeb ? 1.5 : 1,
    borderColor: themeColors.icon,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as "space-between",
    shadowColor: isWeb ? themeColors.tint : "#000",
    shadowOffset: { width: 0, height: isWeb ? 1 : 2 },
    shadowOpacity: isWeb ? 0.08 : 0.1,
    shadowRadius: isWeb ? 12 : 4,
    elevation: isWeb ? 0 : 3,
  };

  const [scale] = React.useState(new Animated.Value(1));

  const handleToggleComplete = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    if (onToggleComplete) {
      onToggleComplete(task.id, task.status !== TaskStatus.COMPLETED);
    }
  };

  return (
    <View
      style={cardStyle}
      accessibilityLabel={`${taskCardTexts.cardLabelPrefix}: ${task.title}`}
    >
      <TouchableOpacity
        onPress={handleToggleComplete}
        accessibilityLabel={
          task.status === TaskStatus.COMPLETED
            ? appTexts.common.taskCompletedA11y
            : taskCardTexts.markCompletedA11y
        }
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.status === TaskStatus.COMPLETED }}
        style={[
          sharedStyles.touchTargetMin,
          {
            marginRight: Spacing.medium,
            marginBottom: 0,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={
              task.status === TaskStatus.COMPLETED
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={28}
            color={
              task.status === TaskStatus.COMPLETED
                ? themeColors.success
                : themeColors.icon
            }
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Content wrapper (title and delete button in a row) */}
      <View
        style={{
          flex: 1,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "space-between" as const,
          width: "100%",
          gap: 0,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => onPress && onPress(task.id)}
          accessibilityLabel={`${taskCardTexts.viewDetailsA11yPrefix}: ${task.title}`}
          accessibilityRole="button"
          disabled={!onPress}
        >
          <AccessibleText
            type="h2"
            style={{
              fontWeight: "bold",
              fontSize: 16 * preferences.fontSizeMultiplier,
              marginBottom: 4,
              color: themeColors.text,
            }}
            accessibilityLabel={`${taskCardTexts.titleLabelPrefix}: ${task.title}`}
          >
            {truncateText(task.title, 45)}
          </AccessibleText>
          {(task.dueDate || task.status === TaskStatus.COMPLETED) && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
              {task.dueDate && (
                <AccessibleText
                  type="caption"
                  style={{ opacity: 0.7, fontSize: 14, color: themeColors.text }}
                  accessibilityLabel={`${taskCardTexts.dueDatePrefix}: ${formatDateRelative(new Date(task.dueDate))}`}
                >
                  {taskCardTexts.dueDatePrefix}: {formatDateRelative(new Date(task.dueDate))}
                </AccessibleText>
              )}
              <DueDateBadge
                status={task.status === TaskStatus.COMPLETED ? "completed" : getDueDateStatus(task.dueDate)}
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete && onDelete(task.id)}
          style={[
            sharedStyles.touchTargetMin,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: themeColors.error + "10",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: themeColors.error + "30",
            },
          ]}
          accessibilityLabel={`${taskCardTexts.deleteTaskA11yPrefix}: ${task.title}`}
          accessibilityRole="button"
          accessibilityHint={`${taskCardTexts.deleteTaskA11yPrefix}. ${appTexts.common.deleteAction}`}
        >
          <Ionicons
            name="trash"
            size={22}
            color={themeColors.error}
            style={{ marginRight: isWebMobile ? 0 : 4 }}
          />
          {!isWebMobile && (
            <AccessibleText
              style={{ color: themeColors.error, fontWeight: "bold", fontSize: 16 }}
            >
              {appTexts.common.deleteAction}
            </AccessibleText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
