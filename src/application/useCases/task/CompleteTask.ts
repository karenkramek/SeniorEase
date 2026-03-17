import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export class CompleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    task.status = TaskStatus.COMPLETED;

    return this.taskRepository.update(task);
  }
}
