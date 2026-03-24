import { Task } from "@/domain/entities/Task";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { formatDate } from "@/presentation/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

export function TaskCard({ task, onDelete, onToggleComplete }: TaskCardProps) {
  const appTexts = useAppStrings();
  const taskCardTexts = appTexts.taskCard;
  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  const cardStyle = {
    backgroundColor: themeColors.background,
    padding: Spacing.medium * preferences.spacingMultiplier,
    borderRadius: Spacing.small,
    marginBottom: Spacing.medium,
    borderWidth: 1,
    borderColor: themeColors.icon,
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "space-between" as "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
      onToggleComplete(task.id, task.status !== "COMPLETED");
    }
  };

  return (
    <View
      style={cardStyle}
      accessibilityLabel={`${taskCardTexts.cardLabelPrefix}: ${task.title}`}
    >
      {/* Ícone de check selecionável à esquerda */}
      <TouchableOpacity
        onPress={handleToggleComplete}
        accessibilityLabel={
          task.status === "COMPLETED"
            ? taskCardTexts.completedA11y
            : taskCardTexts.markCompletedA11y
        }
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.status === "COMPLETED" }}
        style={[
          sharedStyles.touchTargetMin,
          {
            marginRight: Spacing.medium,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={
              task.status === "COMPLETED"
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={28}
            color={
              task.status === "COMPLETED"
                ? themeColors.success
                : themeColors.icon
            }
          />
        </Animated.View>
      </TouchableOpacity>
      {/* Título e vencimento */}
      <View style={{ flex: 1 }}>
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
          {task.title}
        </AccessibleText>
        {task.dueDate && (
          <AccessibleText
            type="caption"
            style={{ opacity: 0.7, fontSize: 14, color: themeColors.text }}
            accessibilityLabel={`${taskCardTexts.dueDateLabelPrefix}: ${formatDate(task.dueDate)}`}
          >
            {taskCardTexts.dueDatePrefix}: {formatDate(task.dueDate)}
          </AccessibleText>
        )}
      </View>
      {/* Botão de excluir à direita */}
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
  );
}
