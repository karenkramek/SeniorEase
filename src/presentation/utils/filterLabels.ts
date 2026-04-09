import { TaskFilter } from "@/domain/enums/TaskFilter";

export const FILTER_LABELS: Record<TaskFilter, string> = {
  PENDING: "Pendentes",
  COMPLETED: "Concluídas",
  UPCOMING: "Prazos próximos",
  OVERDUE: "Vencidas",
};
