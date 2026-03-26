import { TaskStatus } from "@/domain/enums/TaskStatus";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
