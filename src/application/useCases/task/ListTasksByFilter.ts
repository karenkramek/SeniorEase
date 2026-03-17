import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export class ListTasksByFilter {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.findByStatus(status);
  }
}
