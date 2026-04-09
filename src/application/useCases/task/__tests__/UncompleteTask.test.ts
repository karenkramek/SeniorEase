/// <reference types="jest" />
import { TaskStatus } from "@/domain/enums/TaskStatus";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { UncompleteTask } from "../UncompleteTask";

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

describe("UncompleteTask", () => {
  it("chama updateStatus com PENDING para a tarefa informada", async () => {
    const repo = makeRepo({
      updateStatus: jest.fn().mockResolvedValueOnce(undefined),
    });
    const useCase = new UncompleteTask(repo);

    await useCase.execute("t1");

    expect(repo.updateStatus).toHaveBeenCalledWith("t1", TaskStatus.PENDING);
  });
});
