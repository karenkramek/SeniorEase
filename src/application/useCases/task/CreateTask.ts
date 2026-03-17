import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

type CreateTaskInput = {
  title: string;
  dueDate?: Date;
};

export class CreateTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const taskToCreate: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title: input.title,
      dueDate: input.dueDate ? input.dueDate.toISOString() : undefined,
      status: TaskStatus.PENDING,
      steps: [],
    };

    return this.taskRepository.create(taskToCreate);
  }
}
