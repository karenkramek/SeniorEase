import { Step } from "@/domain/entities/Step";
import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

// A simple ID generator for the step. In a real app, this would be more robust (e.g., UUID).
const generateId = () => Math.random().toString(36).substr(2, 9);

export class AddStepToTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, stepDescription: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    const newStep: Step = {
      id: generateId(),
      title: stepDescription,
      isCompleted: false,
      order: task.steps.length + 1,
    };

    task.steps.push(newStep);

    return this.taskRepository.update(task);
  }
}
