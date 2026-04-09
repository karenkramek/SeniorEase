/// <reference types="jest" />
import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import {
    TaskCompletedException,
    TaskNotFoundException,
} from "@/domain/exceptions";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { EditTask } from "../EditTask";

const pendingTask: Task = {
  id: "t1",
  userId: "u1",
  title: "Tarefa original",
  status: TaskStatus.PENDING,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const completedTask: Task = {
  ...pendingTask,
  status: TaskStatus.COMPLETED,
  completedAt: "2026-01-02T00:00:00.000Z",
};

const makeRepo = (overrides: Partial<ITaskRepository> = {}): ITaskRepository =>
  ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  }) as unknown as ITaskRepository;

describe("EditTask", () => {
  it("lança TaskNotFoundException quando tarefa não existe", async () => {
    const repo = makeRepo({ findById: jest.fn().mockResolvedValueOnce(null) });
    const useCase = new EditTask(repo);

    await expect(
      useCase.execute({ id: "t1", title: "Novo título" }),
    ).rejects.toThrow(TaskNotFoundException);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("lança TaskCompletedException ao tentar editar tarefa concluída", async () => {
    const repo = makeRepo({
      findById: jest.fn().mockResolvedValueOnce(completedTask),
    });
    const useCase = new EditTask(repo);

    await expect(
      useCase.execute({ id: "t1", title: "Novo título" }),
    ).rejects.toThrow(TaskCompletedException);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("atualiza título e descrição de tarefa pendente com sucesso", async () => {
    const updatedTask: Task = {
      ...pendingTask,
      title: "Novo título",
      description: "Novo detalhe",
    };
    const repo = makeRepo({
      findById: jest.fn().mockResolvedValueOnce(pendingTask),
      update: jest.fn().mockResolvedValueOnce(updatedTask),
    });
    const useCase = new EditTask(repo);

    const result = await useCase.execute({
      id: "t1",
      title: "Novo título",
      description: "Novo detalhe",
    });

    expect(repo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Novo título",
        description: "Novo detalhe",
      }),
    );
    expect(result).toEqual(updatedTask);
  });

  it("converte dueDate para ISO string ao atualizar", async () => {
    const dueDate = new Date("2026-06-15T00:00:00.000Z");
    const repo = makeRepo({
      findById: jest.fn().mockResolvedValueOnce(pendingTask),
      update: jest.fn().mockResolvedValueOnce({} as Task),
    });
    const useCase = new EditTask(repo);

    await useCase.execute({ id: "t1", title: "Consulta", dueDate });

    expect(repo.update).toHaveBeenCalledWith(
      expect.objectContaining({ dueDate: dueDate.toISOString() }),
    );
  });
});
