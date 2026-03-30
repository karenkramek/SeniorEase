import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { formatDateRelative } from "@/presentation/utils/format";
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

  // Responsive breakpoint: md = 768px
  const isSmallScreen = windowWidth < 768;

  const cardStyle = {
    backgroundColor: themeColors.background,
    padding: Spacing.medium * preferences.spacingMultiplier,
    borderRadius: isWeb ? 16 : Spacing.small,
    marginBottom: Spacing.medium,
    borderWidth: isWeb ? 1.5 : 1,
    borderColor: themeColors.icon,
    flexDirection: (isSmallScreen ? "column" : "row") as "row" | "column",
    alignItems: isSmallScreen ? ("flex-start" as const) : ("center" as const),
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
            ? taskCardTexts.completedA11y
            : taskCardTexts.markCompletedA11y
        }
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.status === TaskStatus.COMPLETED }}
        style={[
          sharedStyles.touchTargetMin,
          {
            marginRight: isSmallScreen ? 0 : Spacing.medium,
            marginBottom: isSmallScreen ? Spacing.small : 0,
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

      {/* Content wrapper (title and delete button stacked on sm) */}
      <View
        style={{
          flex: 1,
          flexDirection: isSmallScreen ? ("column" as const) : ("row" as const),
          alignItems: isSmallScreen ? ("flex-start" as const) : ("center" as const),
          justifyContent: "space-between" as const,
          width: "100%",
          gap: isSmallScreen ? Spacing.small : 0,
        }}
      >
        <TouchableOpacity
          style={{ flex: isSmallScreen ? 0 : 1 }}
          onPress={() => onPress && onPress(task.id)}
          accessibilityLabel={`Ver detalhes da tarefa: ${task.title}`}
          accessibilityRole="button"
          disabled={!onPress}
        >
          <AccessibleText
            type="h2"
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 4,
              color: themeColors.text,
            }}
            accessibilityLabel={`${taskCardTexts.titleLabelPrefix}: ${task.title}`}
          >
            {truncateText(task.title, 45)}
          </AccessibleText>
          {task.dueDate && (
            <AccessibleText
              type="caption"
              style={{ opacity: 0.7, fontSize: 14, color: themeColors.text }}
              accessibilityLabel={`${taskCardTexts.dueDateLabelPrefix}: ${formatDateRelative(new Date(task.dueDate))}`}
            >
              {taskCardTexts.dueDatePrefix}: {formatDateRelative(new Date(task.dueDate))}
            </AccessibleText>
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
              paddingHorizontal: 10,
              paddingVertical: 10,
            },
          ]}
          accessibilityLabel={`${taskCardTexts.deleteTaskA11yPrefix}: ${task.title}`}
          accessibilityRole="button"
        >
          <Ionicons
            name="trash"
            size={22}
            color={themeColors.error}
            style={{ marginRight: 4 }}
          />
          <AccessibleText
            style={{ color: themeColors.error, fontWeight: "bold", fontSize: 16 }}
          >
            {taskCardTexts.deleteAction}
          </AccessibleText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
