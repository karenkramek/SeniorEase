import { TaskRepository } from "@/infrastructure/repositories/TaskRepository";
import React, { createContext, useContext } from "react";

const taskRepository = new TaskRepository();

const TaskRepositoryContext = createContext(taskRepository);

export const TaskRepositoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <TaskRepositoryContext.Provider value={taskRepository}>
    {children}
  </TaskRepositoryContext.Provider>
);

export const useTaskRepository = () => useContext(TaskRepositoryContext);
