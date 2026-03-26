import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { CreateTask } from "@/application/useCases/task/CreateTask";
import { DeleteTask } from "@/application/useCases/task/DeleteTask";
import { ListTasks } from "@/application/useCases/task/ListTasks";
import { UncompleteTask } from "@/application/useCases/task/UncompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useTasks() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const taskRepository = useTaskRepository();
  const createTaskUseCase = useMemo(
    () => new CreateTask(taskRepository),
    [taskRepository],
  );
  const listTasksUseCase = useMemo(
    () => new ListTasks(taskRepository),
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

  const refreshTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const allTasks = await listTasksUseCase.execute();
      setTasks(
        allTasks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error("Falha ao carregar as tarefas", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, listTasksUseCase]);

  useEffect(() => {
    if (!authLoading) refreshTasks();
  }, [authLoading, refreshTasks]);

  const createTask = useCallback(
    async (data: { title: string; description?: string; dueDate?: Date }) => {
      if (!user) throw new Error("Usuário não autenticado.");
      await createTaskUseCase.execute({ ...data, userId: user.id });
      await refreshTasks();
    },
    [user, createTaskUseCase, refreshTasks],
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      await completeTaskUseCase.execute(taskId);
      await refreshTasks();
    },
    [completeTaskUseCase, refreshTasks],
  );

  const uncompleteTask = useCallback(
    async (taskId: string) => {
      await uncompleteTaskUseCase.execute(taskId);
      await refreshTasks();
    },
    [uncompleteTaskUseCase, refreshTasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await deleteTaskUseCase.execute(taskId);
      await refreshTasks();
    },
    [deleteTaskUseCase, refreshTasks],
  );

  const getFilteredTasks = useCallback(
    (status: TaskStatus) => {
      return tasks.filter((t) => t.status === status);
    },
    [tasks],
  );

  return {
    tasks,
    isLoading,
    refreshTasks,
    createTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    getFilteredTasks,
  };
}
