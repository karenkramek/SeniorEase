import { TaskRepository } from "@/infrastructure/repositories/TaskRepository";
import { UniversalStorageAdapter } from "@/infrastructure/storage/UniversalStorageAdapter";
import React, { createContext, useContext } from "react";

const storage = new UniversalStorageAdapter();
const taskRepository = new TaskRepository(storage);

const TaskRepositoryContext = createContext(taskRepository);

export const TaskRepositoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <TaskRepositoryContext.Provider value={taskRepository}>
    {children}
  </TaskRepositoryContext.Provider>
);

export const useTaskRepository = () => useContext(TaskRepositoryContext);
