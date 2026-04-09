import { TaskNotFoundException } from "@/domain/exceptions";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export class DeleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundException();
    }

    await this.taskRepository.delete(taskId);
  }
}
