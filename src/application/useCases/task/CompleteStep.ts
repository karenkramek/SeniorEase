import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export class CompleteStep {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, stepId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    const step = task.steps.find((s) => s.id === stepId);

    if (!step) {
      throw new Error("Step not found");
    }

    step.isCompleted = true;

    return this.taskRepository.update(task);
  }
}
