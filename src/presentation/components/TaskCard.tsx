import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { formatDateRelative } from "@/presentation/utils/format";
import { truncateText } from "@/presentation/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";

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
  const { themeColors, preferences } = useTheme();

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
      onToggleComplete(task.id, task.status !== TaskStatus.COMPLETED);
    }
  };

  return (
    <View
      style={cardStyle}
      accessibilityLabel={`Cartão da tarefa: ${task.title}`}
    >
      {/* Ícone de check selecionável à esquerda */}
      <TouchableOpacity
        onPress={handleToggleComplete}
        accessibilityLabel={
          task.status === TaskStatus.COMPLETED
            ? "Tarefa concluída"
            : "Marcar como concluída"
        }
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.status === TaskStatus.COMPLETED }}
        style={{ marginRight: Spacing.medium }}
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
      {/* Título e vencimento — tocável para abrir detalhes */}
      <TouchableOpacity
        style={{ flex: 1 }}
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
          accessibilityLabel={`Título da tarefa: ${task.title}`}
        >
          {truncateText(task.title, 45)}
        </AccessibleText>
        {task.dueDate && (
          <AccessibleText
            type="caption"
            style={{ opacity: 0.7, fontSize: 14, color: themeColors.text }}
            accessibilityLabel={`Vencimento: ${formatDateRelative(new Date(task.dueDate!))}`}
          >
            Vencimento: {formatDateRelative(new Date(task.dueDate!))}
          </AccessibleText>
        )}
      </TouchableOpacity>
      {/* Botão de excluir à direita */}
      <TouchableOpacity
        onPress={() => onDelete && onDelete(task.id)}
        style={{ flexDirection: "row", alignItems: "center", padding: 8 }}
        accessibilityLabel={`Excluir tarefa: ${task.title}`}
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
          Excluir
        </AccessibleText>
      </TouchableOpacity>
    </View>
  );
}
