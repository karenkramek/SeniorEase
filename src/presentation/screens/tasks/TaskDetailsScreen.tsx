import { CompleteStep } from "@/application/useCases/task/CompleteStep";
import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskRepository } from "@/infrastructure/repositories/TaskRepository";
import { UniversalStorageAdapter } from "@/infrastructure/storage/UniversalStorageAdapter";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { formatDate } from "@/presentation/utils/date";
import React, { useState } from "react";
import { Alert } from "react-native";

const storage = new UniversalStorageAdapter();
const taskRepository = new TaskRepository(storage);
const completeTaskUseCase = new CompleteTask(taskRepository);
const completeStepUseCase = new CompleteStep(taskRepository);

const TaskDetailsScreen: React.FC<{ task: Task }> = ({ task }) => {
  const [stepsStatus, setStepsStatus] = useState<boolean[]>(
    task.steps.map((s) => s.isCompleted),
  );
  const [isCompleted, setIsCompleted] = useState(task.status === "COMPLETED");
  const [showCongrats, setShowCongrats] = useState(false);

  const handleStepToggle = async (index: number) => {
    const updatedStatus = [...stepsStatus];
    updatedStatus[index] = !updatedStatus[index];
    setStepsStatus(updatedStatus);
    const stepId = task.steps[index].id;
    await completeStepUseCase.execute(task.id, stepId);
    // Se todas as etapas estiverem concluídas, permitir conclusão
    if (updatedStatus.every(Boolean) && !isCompleted) {
      handleCompleteTask();
    }
  };

  const handleCompleteTask = async () => {
    await completeTaskUseCase.execute(task.id);
    setIsCompleted(true);
    setShowCongrats(true);
    Alert.alert("Parabéns!", "Você concluiu sua tarefa com sucesso.", [
      { text: "OK", onPress: () => setShowCongrats(false) },
    ]);
    // Card temporário some após 3 segundos
    setTimeout(() => setShowCongrats(false), 3000);
  };

  return (
    <div style={{ padding: 24 }}>
      <AccessibleText type="h1">{task.title}</AccessibleText>
      {task.dueDate && (
        <AccessibleText>Prazo: {formatDate(task.dueDate)}</AccessibleText>
      )}
      <AccessibleText>Etapas:</AccessibleText>
      <ul>
        {task.steps
          .sort((a, b) => a.order - b.order)
          .map((step, idx) => (
            <li key={step.id}>
              <label>
                <input
                  type="checkbox"
                  checked={stepsStatus[idx]}
                  onChange={() => handleStepToggle(idx)}
                  disabled={isCompleted}
                />
                <AccessibleText>{step.title}</AccessibleText>
              </label>
            </li>
          ))}
      </ul>
      <AccessibleButton
        title="Marcar tarefa como concluída"
        onPress={handleCompleteTask}
        disabled={isCompleted}
        style={{ paddingVertical: 12, paddingHorizontal: 24, marginTop: 16 }}
      />
      {showCongrats && (
        <div
          style={{
            background: "#e0ffe0",
            borderRadius: 8,
            padding: 16,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          <AccessibleText type="h2">✔ Parabéns!</AccessibleText>
          <AccessibleText>Você concluiu sua tarefa.</AccessibleText>
          <AccessibleText>Ótimo trabalho!</AccessibleText>
        </div>
      )}
      {isCompleted && <AccessibleText>Tarefa concluída!</AccessibleText>}
    </div>
  );
};

export default TaskDetailsScreen;
