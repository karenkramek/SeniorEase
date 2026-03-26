import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";

export interface ITaskRepository {
  create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  findByStatus(status: TaskStatus): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  updateStatus(taskId: string, status: TaskStatus): Promise<void>;
  delete(id: string): Promise<void>;
}
