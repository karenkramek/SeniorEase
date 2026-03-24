import { CompleteStep } from "@/application/useCases/task/CompleteStep";
import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskRepository } from "@/infrastructure/repositories/TaskRepository";
import { UniversalStorageAdapter } from "@/infrastructure/storage/UniversalStorageAdapter";
import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useNotification } from "@/presentation/hooks/useNotification";
import { formatDate } from "@/presentation/utils/date";
import React, { useState } from "react";

const storage = new UniversalStorageAdapter();
const taskRepository = new TaskRepository(storage);
const completeTaskUseCase = new CompleteTask(taskRepository);
const completeStepUseCase = new CompleteStep(taskRepository);

const TaskDetailsScreen: React.FC<{ task: Task }> = ({ task }) => {
  const strings = useAppStrings().taskDetails;
  const { showNotification } = useNotification();
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
    try {
      await completeStepUseCase.execute(task.id, stepId);
    } catch (error) {
      console.error("Falha ao atualizar etapa", error);
      showNotification(strings.stepUpdateError, "error");
      return;
    }

    // Se todas as etapas estiverem concluídas, permitir conclusão
    if (updatedStatus.every(Boolean) && !isCompleted) {
      await handleCompleteTask();
    }
  };

  const handleCompleteTask = async () => {
    try {
      await completeTaskUseCase.execute(task.id);
      setIsCompleted(true);
      setShowCongrats(true);
      showNotification(strings.completeSuccess, "success");
      // Card temporário some após 3 segundos
      setTimeout(() => setShowCongrats(false), 3000);
    } catch (error) {
      console.error("Falha ao concluir tarefa", error);
      showNotification(strings.completeError, "error");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <AccessibleText type="h1">{task.title}</AccessibleText>
      {task.dueDate && (
        <AccessibleText>
          {strings.dueDateLabel}: {formatDate(task.dueDate)}
        </AccessibleText>
      )}
      <AccessibleText>{strings.stepsLabel}:</AccessibleText>
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
        title={strings.completeButton}
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
          <AccessibleText type="h2">✔ {strings.congratsTitle}</AccessibleText>
          <AccessibleText>{strings.congratsBody1}</AccessibleText>
          <AccessibleText>{strings.congratsBody2}</AccessibleText>
        </div>
      )}
      {isCompleted && <AccessibleText>{strings.completedTag}</AccessibleText>}
    </div>
  );
};

export default TaskDetailsScreen;
