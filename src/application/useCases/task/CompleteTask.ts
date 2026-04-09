import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { TaskNotFoundException } from "@/domain/exceptions";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export class CompleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundException();
    }

    return this.taskRepository.update({
      ...task,
      status: TaskStatus.COMPLETED,
      completedAt: new Date().toISOString(),
    });
  }
}
