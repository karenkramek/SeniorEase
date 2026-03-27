import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

type CreateTaskInput = {
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
};

export class CreateTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const taskToCreate: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      userId: input.userId,
      title: input.title,
      description: input.description,
      dueDate: input.dueDate ? input.dueDate.toISOString() : undefined,
      status: TaskStatus.PENDING,
    };

    return this.taskRepository.create(taskToCreate);
  }
}
