/// <reference types="jest" />
import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { CreateTask } from "../CreateTask";

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

describe("CreateTask", () => {
  it("cria tarefa com status PENDING e sem data de vencimento", async () => {
    const createdTask: Task = {
      id: "t1",
      userId: "u1",
      title: "Tomar remédio",
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const repo = makeRepo({
      create: jest.fn().mockResolvedValueOnce(createdTask),
    });
    const useCase = new CreateTask(repo);

    const result = await useCase.execute({
      userId: "u1",
      title: "Tomar remédio",
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "u1",
        title: "Tomar remédio",
        status: TaskStatus.PENDING,
        dueDate: undefined,
      }),
    );
    expect(result).toEqual(createdTask);
  });

  it("converte dueDate para ISO string antes de persistir", async () => {
    const dueDate = new Date("2026-05-01T00:00:00.000Z");
    const repo = makeRepo({
      create: jest.fn().mockResolvedValueOnce({} as Task),
    });
    const useCase = new CreateTask(repo);

    await useCase.execute({ userId: "u1", title: "Consulta", dueDate });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ dueDate: dueDate.toISOString() }),
    );
  });

  it("passa descrição opcional ao repositório", async () => {
    const repo = makeRepo({
      create: jest.fn().mockResolvedValueOnce({} as Task),
    });
    const useCase = new CreateTask(repo);

    await useCase.execute({
      userId: "u1",
      title: "Comprar pão",
      description: "Integral",
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ description: "Integral" }),
    );
  });
});
