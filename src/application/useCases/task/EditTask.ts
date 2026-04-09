import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import {
  TaskCompletedException,
  TaskNotFoundException,
} from "@/domain/exceptions";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

type EditTaskInput = {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
};

export class EditTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: EditTaskInput): Promise<Task> {
    const existingTask = await this.taskRepository.findById(input.id);
    if (!existingTask) {
      throw new TaskNotFoundException();
    }

    if (existingTask.status === TaskStatus.COMPLETED) {
      throw new TaskCompletedException();
    }

    const taskToUpdate: Task = {
      ...existingTask,
      title: input.title,
      description: input.description,
      dueDate: input.dueDate ? input.dueDate.toISOString() : undefined,
    };

    return this.taskRepository.update(taskToUpdate);
  }
}
