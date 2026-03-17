import { AddStepToTask } from "@/application/useCases/task/AddStepToTask";
import { CompleteStep } from "@/application/useCases/task/CompleteStep";
import { CompleteTask } from "@/application/useCases/task/CompleteTask";
import { CreateTask } from "@/application/useCases/task/CreateTask";
import { ListTasks } from "@/application/useCases/task/ListTasks";
import { UncompleteTask } from "@/application/useCases/task/UncompleteTask";
import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { TaskRepository } from "@/infrastructure/repositories/TaskRepository";
import { UniversalStorageAdapter } from "@/infrastructure/storage/UniversalStorageAdapter";
import { useCallback, useEffect, useState } from "react";

// Injeção de dependência manual
const storage = new UniversalStorageAdapter();
const taskRepository: ITaskRepository = new TaskRepository(storage);

const createTaskUseCase = new CreateTask(taskRepository);
const listTasksUseCase = new ListTasks(taskRepository);
const completeTaskUseCase = new CompleteTask(taskRepository);
const addStepToTaskUseCase = new AddStepToTask(taskRepository);
const completeStepUseCase = new CompleteStep(taskRepository);
const uncompleteTaskUseCase = new UncompleteTask(taskRepository);
const deleteTaskUseCase = taskRepository.delete.bind(taskRepository);

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const createTask = useCallback(
    async (data: { title: string; description?: string; dueDate?: Date }) => {
      await createTaskUseCase.execute(data);
      await refreshTasks();
    },
    [refreshTasks],
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      await completeTaskUseCase.execute(taskId);
      await refreshTasks();
    },
    [refreshTasks],
  );

  const uncompleteTask = useCallback(
    async (taskId: string) => {
      await uncompleteTaskUseCase.execute(taskId);
      await refreshTasks();
    },
    [refreshTasks],
  );

  const addStepToTask = useCallback(
    async (taskId: string, stepDescription: string) => {
      await addStepToTaskUseCase.execute(taskId, stepDescription);
      await refreshTasks();
    },
    [refreshTasks],
  );

  const completeStep = useCallback(
    async (taskId: string, stepId: string) => {
      await completeStepUseCase.execute(taskId, stepId);
      await refreshTasks();
    },
    [refreshTasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await deleteTaskUseCase(taskId);
      await refreshTasks();
    },
    [refreshTasks],
  );

  const getFilteredTasks = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  return {
    tasks,
    isLoading,
    refreshTasks,
    createTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    addStepToTask,
    completeStep,
    getFilteredTasks,
  };
}
