import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useTheme } from "@/presentation/hooks/useTheme";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { showAlert } from "@/presentation/utils/alert";
import { formatDateLong } from "@/presentation/utils/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { themeColors } = useTheme();

  const taskRepository = useTaskRepository();
  const completeTaskUseCase = useMemo(
    () => new CompleteTask(taskRepository),
    [taskRepository],
  );

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!taskId) return;
      const found = await taskRepository.findById(taskId);
      setTask(found);
      setLoading(false);
    };
    load();
  }, [taskId, taskRepository]);

  const handleCompleteTask = async () => {
    if (!task) return;
    await completeTaskUseCase.execute(task.id);
    showAlert("Parabéns!", "Você concluiu sua tarefa com sucesso.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

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
        <AccessibleText accessibilityLabel="Tarefa não encontrada">
          Tarefa não encontrada.
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
        accessibilityLabel={`Título: ${task.title}`}
      >
        {task.title}
      </AccessibleText>

      {task.dueDate && (
        <AccessibleText
          type="caption"
          style={{ color: themeColors.icon, marginBottom: Spacing.medium }}
          accessibilityLabel={`Prazo: ${formatDateLong(new Date(task.dueDate!))}`}
        >
          Prazo: {formatDateLong(new Date(task.dueDate!))}
        </AccessibleText>
      )}

      {task.status !== TaskStatus.COMPLETED ? (
        <View style={{ alignItems: "center", marginTop: Spacing.medium }}>
          <AccessibleButton
            title="Marcar como Concluída"
            onPress={handleCompleteTask}
            accessibilityLabel="Botão para marcar tarefa como concluída"
            style={sharedStyles.createButton}
          />
        </View>
      ) : (
        <AccessibleText
          style={{
            color: themeColors.success,
            textAlign: "center",
            marginTop: Spacing.medium,
          }}
          accessibilityLabel="Tarefa concluída"
        >
          ✔ Tarefa concluída!
        </AccessibleText>
      )}
    </ScrollView>
  );
}
