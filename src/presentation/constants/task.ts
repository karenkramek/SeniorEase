/**
 * Constantes e configurações da aplicação
 * Define tipos de tarefas e categorias sugeridas
 */

import { TaskStatus } from "@/domain/enums/TaskStatus";
import { TaskStatusColors } from "@/presentation/theme/colors";
import { TASK_STATUS_ICONS } from "@/presentation/utils/icons";

// ============================================================================
// TIPOS DE TAREFA
// ============================================================================

/** Lista de todos os tipos de tarefa disponíveis */
export const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.PENDING,
  TaskStatus.COMPLETED,
];

/** Labels amigáveis para cada tipo de tarefa */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pendente",
  [TaskStatus.COMPLETED]: "Concluída",
};

/** Descrições para cada tipo de tarefa */
export const TASK_STATUS_DESCRIPTIONS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Tarefas que ainda não foram iniciadas",
  [TaskStatus.COMPLETED]: "Tarefas que já foram finalizadas",
};

/**
 * Configuração completa dos tipos de tarefa
 * Objeto gerado dinamicamente combinando ícones, cores, labels e descrições
 */
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

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

// Retorna a configuração completa de um tipo de tarefa
export function getTaskStatusConfig(type: TaskStatus) {
  return TASK_STATUS_CONFIG[type];
}

// Verifica se uma string é um tipo de tarefa válido
export function isValidTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" && TASK_STATUSES.includes(value as TaskStatus)
  );
}

// Retorna a label de um tipo de tarefa
export function getTaskStatusLabel(type: TaskStatus): string {
  return TASK_STATUS_LABELS[type] || type;
}

// Retorna a descrição de um tipo de tarefa
export function getTaskStatusDescription(type: TaskStatus): string {
  return TASK_STATUS_DESCRIPTIONS[type] || "";
}
