import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { IStorage } from "@/infrastructure/storage/IStorage";

const TASKS_STORAGE_KEY = "tasks";

// Simple ID generation for now.
const generateId = () => Math.random().toString(36).substr(2, 9);

export class TaskRepository implements ITaskRepository {
  constructor(private storage: IStorage) {}

  private async getTasks(): Promise<Task[]> {
    const tasksJson = await this.storage.getItem(TASKS_STORAGE_KEY);
    if (!tasksJson) {
      return [];
    }
    // Retorna as tarefas como estão no JSON, sem conversão de datas.
    return JSON.parse(tasksJson);
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await this.storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }

  async create(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ): Promise<Task> {
    const tasks = await this.getTasks();
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  async findAll(): Promise<Task[]> {
    return this.getTasks();
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find((task) => task.id === id) || null;
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((task) => task.status === status);
  }

  async update(updatedTask: Task): Promise<Task> {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id);
    if (taskIndex === -1) {
      throw new Error("Task to update not found.");
    }
    tasks[taskIndex] = updatedTask;
    await this.saveTasks(tasks);
    return updatedTask;
  }

  async updateStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task to update not found.");
    }
    tasks[taskIndex].status = status;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    await this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    await this.saveTasks(filteredTasks);
  }
}
