import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export class UncompleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    await this.taskRepository.updateStatus(taskId, TaskStatus.PENDING);
  }
}
