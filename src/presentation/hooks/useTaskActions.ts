import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { CreateTask } from "@/application/useCases/task/CreateTask";
import { DeleteTask } from "@/application/useCases/task/DeleteTask";
import { EditTask } from "@/application/useCases/task/EditTask";
import { UncompleteTask } from "@/application/useCases/task/UncompleteTask";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useCallback, useMemo } from "react";

export function useTaskActions(refreshTasks?: () => Promise<void>) {
  const { user } = useAuth();
  const taskRepository = useTaskRepository();

  const createTaskUseCase = useMemo(
    () => new CreateTask(taskRepository),
    [taskRepository],
  );
  const completeTaskUseCase = useMemo(
    () => new CompleteTask(taskRepository),
    [taskRepository],
  );
  const uncompleteTaskUseCase = useMemo(
    () => new UncompleteTask(taskRepository),
    [taskRepository],
  );
  const deleteTaskUseCase = useMemo(
    () => new DeleteTask(taskRepository),
    [taskRepository],
  );
  const editTaskUseCase = useMemo(
    () => new EditTask(taskRepository),
    [taskRepository],
  );

  const createTask = useCallback(
    async (data: { title: string; description?: string; dueDate?: Date }) => {
      if (!user) throw new Error("Usuário não autenticado.");
      await createTaskUseCase.execute({ ...data, userId: user.id });
      await refreshTasks?.();
    },
    [user, createTaskUseCase, refreshTasks],
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      await completeTaskUseCase.execute(taskId);
      await refreshTasks?.();
    },
    [completeTaskUseCase, refreshTasks],
  );

  const uncompleteTask = useCallback(
    async (taskId: string) => {
      await uncompleteTaskUseCase.execute(taskId);
      await refreshTasks?.();
    },
    [uncompleteTaskUseCase, refreshTasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await deleteTaskUseCase.execute(taskId);
      await refreshTasks?.();
    },
    [deleteTaskUseCase, refreshTasks],
  );

  const editTask = useCallback(
    async (
      taskId: string,
      data: { title: string; description?: string; dueDate?: Date },
    ) => {
      await editTaskUseCase.execute({ id: taskId, ...data });
      await refreshTasks?.();
    },
    [editTaskUseCase, refreshTasks],
  );

  return {
    createTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    editTask,
  };
}
