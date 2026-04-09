import { ListTasks } from "@/application/useCases/task/ListTasks";
import { Task } from "@/domain/entities/Task";
import { useTaskRepository } from "@/presentation/contexts/TaskRepositoryContext";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useTaskList() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const taskRepository = useTaskRepository();
  const listTasksUseCase = useMemo(
    () => new ListTasks(taskRepository),
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

  return {
    tasks,
    isLoading,
    refreshTasks,
  };
}
