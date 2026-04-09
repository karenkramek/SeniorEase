import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { Task } from "@/domain/entities/Task";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useConfirmationFlow } from "@/presentation/hooks/useConfirmationFlow";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { useEffect, useMemo, useState } from "react";

interface UseTaskDetailsOptions {
  taskId: string | null;
  enabled?: boolean;
  onCompleted?: () => void;
}

export function useTaskDetails({
  taskId,
  enabled = true,
  onCompleted,
}: UseTaskDetailsOptions) {
  const appTexts = useAppStrings();
  const strings = appTexts.taskDetails;
  const commonStrings = appTexts.common;
  const { preferences } = usePreferences();

  const taskRepository = useTaskRepository();
  const completeTaskUseCase = useMemo(
    () => new CompleteTask(taskRepository),
    [taskRepository],
  );

  const confirmationFlow = useConfirmationFlow();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!enabled || !taskId) return;
    const load = async () => {
      setLoading(true);
      const found = await taskRepository.findById(taskId);
      setTask(found);
      setLoading(false);
    };
    load();
  }, [taskId, enabled, taskRepository]);

  const executeComplete = async () => {
    if (!task) return;
    try {
      await completeTaskUseCase.execute(task.id);
      confirmationFlow.showSuccess({
        message: appTexts.taskList.taskCompleted,
        duration: 6000,
      });
      setTimeout(() => onCompleted?.(), 1000);
    } catch (_error) {
      console.log(_error);
      confirmationFlow.showError(strings.completeError);
    }
  };

  const handleCompleteTask = async () => {
    if (!task) return;

    if (preferences?.confirmOnComplete) {
      confirmationFlow.showConfirmation({
        title: appTexts.taskList.confirmCompleteTitle,
        message: appTexts.taskList.confirmCompleteMessage,
        confirmText: appTexts.taskList.confirmCompleteAction,
        cancelText: commonStrings.cancel,
        iconName: "checkmark-circle",
        onConfirm: executeComplete,
      });
    } else {
      await executeComplete();
    }
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    if (taskId) {
      const updated = await taskRepository.findById(taskId);
      setTask(updated);
    }
  };

  const openEditModal = () => setIsEditModalOpen(true);

  return {
    task,
    loading,
    isEditModalOpen,
    confirmationFlow,
    handleCompleteTask,
    handleEditSuccess,
    openEditModal,
    strings,
    commonStrings,
  };
}
