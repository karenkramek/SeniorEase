import { Step } from "./Step";

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  status: "PENDING" | "COMPLETED";
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}
