import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
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
    // Buscar tarefa existente para manter as propriedades que não estão sendo editadas
    const existingTask = await this.taskRepository.findById(input.id);
    if (!existingTask) {
      throw new Error("Tarefa não encontrada.");
    }

    // Não permitir edição de tarefa completa
    if (existingTask.status === TaskStatus.COMPLETED) {
      throw new Error("Não é possível editar uma tarefa concluída.");
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
