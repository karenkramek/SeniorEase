/// <reference types="jest" />
import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { TaskNotFoundException } from "@/domain/exceptions";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { DeleteTask } from "../DeleteTask";

const existingTask: Task = {
  id: "t1",
  userId: "u1",
  title: "Comprar pão",
  status: TaskStatus.PENDING,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
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

describe("DeleteTask", () => {
  it("lança TaskNotFoundException quando tarefa não existe", async () => {
    const repo = makeRepo({ findById: jest.fn().mockResolvedValueOnce(null) });
    const useCase = new DeleteTask(repo);

    await expect(useCase.execute("t1")).rejects.toThrow(TaskNotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it("deleta tarefa existente com sucesso", async () => {
    const repo = makeRepo({
      findById: jest.fn().mockResolvedValueOnce(existingTask),
      delete: jest.fn().mockResolvedValueOnce(undefined),
    });
    const useCase = new DeleteTask(repo);

    await useCase.execute("t1");

    expect(repo.delete).toHaveBeenCalledWith("t1");
  });
});
