import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export class DeleteTask {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error("Tarefa não encontrada.");
    }

    await this.taskRepository.delete(taskId);
  }
}
