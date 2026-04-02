import { TaskStatus } from "@/domain/enums/TaskStatus";
import { appStrings } from "@/presentation/i18n/strings";
import { TaskStatusColors } from "@/presentation/theme/colors";
import { TASK_STATUS_ICONS } from "@/presentation/utils/icons";

export const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.PENDING,
  TaskStatus.COMPLETED,
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: appStrings.taskStatus.pendingLabel,
  [TaskStatus.COMPLETED]: appStrings.taskStatus.completedLabel,
};

export const TASK_STATUS_DESCRIPTIONS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: appStrings.taskStatus.pendingDescription,
  [TaskStatus.COMPLETED]: appStrings.taskStatus.completedDescription,
};

/** Combina ícone, cor, label e descrição de cada status em um único objeto. */
export const TASK_STATUS_CONFIG = TASK_STATUSES.reduce(
  (config, type) => {
    config[type] = {
      label: TASK_STATUS_LABELS[type],
      icon: TASK_STATUS_ICONS[type],
      color: TaskStatusColors[type],
      description: TASK_STATUS_DESCRIPTIONS[type],
    };
    return config;
  },
  {} as Record<
    TaskStatus,
    {
      label: string;
      icon: string;
      color: string;
      description: string;
    }
  >,
);

export function getTaskStatusConfig(type: TaskStatus) {
  return TASK_STATUS_CONFIG[type];
}

export function isValidTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" && TASK_STATUSES.includes(value as TaskStatus)
  );
}

export function getTaskStatusLabel(type: TaskStatus): string {
  return TASK_STATUS_LABELS[type] || type;
}

export function getTaskStatusDescription(type: TaskStatus): string {
  return TASK_STATUS_DESCRIPTIONS[type] || "";
}
