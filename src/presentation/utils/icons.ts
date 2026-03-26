/**
 * Configuração centralizada de ícones da aplicação
 * Responsável por toda a lógica visual de ícones
 * Ícones disponíveis: https://icons.expo.fyi/Index/Ionicons
 */

import { TaskStatus } from "@/domain/enums/TaskStatus";
import { Ionicons } from "@expo/vector-icons";

// ============================================================================
// TIPOS DE TAREFA
// ============================================================================

/** Mapa de ícones por tipo de tarefa */
export const TASK_STATUS_ICONS: Record<
  TaskStatus,
  keyof typeof Ionicons.glyphMap
> = {
  [TaskStatus.PENDING]: "hourglass-outline",
  [TaskStatus.COMPLETED]: "checkmark-circle-outline",
};

// ============================================================================
// NAVEGAÇÃO (TABS)
// ============================================================================

/** Ícones de navegação com estados focused/unfocused */
export const NAVIGATION_ICONS = {
  tasks: {
    focused: "list" as keyof typeof Ionicons.glyphMap,
    unfocused: "list-outline" as keyof typeof Ionicons.glyphMap,
  },
  preferences: {
    focused: "settings" as keyof typeof Ionicons.glyphMap,
    unfocused: "settings-outline" as keyof typeof Ionicons.glyphMap,
  },
  help: {
    focused: "help-circle" as keyof typeof Ionicons.glyphMap,
    unfocused: "help-circle-outline" as keyof typeof Ionicons.glyphMap,
  },
  profile: {
    focused: "person" as keyof typeof Ionicons.glyphMap,
    unfocused: "person-outline" as keyof typeof Ionicons.glyphMap,
  },
} as const;

// ============================================================================
// AÇÕES DO USUÁRIO
// ============================================================================

/** Ícones de ações (botões, comandos) */
export const ACTION_ICONS = {
  logout: "log-out-outline" as keyof typeof Ionicons.glyphMap,
  add: "add-circle" as keyof typeof Ionicons.glyphMap,
  edit: "create-outline" as keyof typeof Ionicons.glyphMap,
  delete: "trash-outline" as keyof typeof Ionicons.glyphMap,
  filter: "funnel-outline" as keyof typeof Ionicons.glyphMap,
  search: "search-outline" as keyof typeof Ionicons.glyphMap,
  close: "close" as keyof typeof Ionicons.glyphMap,
  check: "checkmark" as keyof typeof Ionicons.glyphMap,
} as const;

// ============================================================================
// ESTADOS E FEEDBACK
// ============================================================================

/** Ícones para estados e feedback visual */
export const STATUS_ICONS = {
  success: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
  error: "close-circle" as keyof typeof Ionicons.glyphMap,
  warning: "warning" as keyof typeof Ionicons.glyphMap,
  info: "information-circle" as keyof typeof Ionicons.glyphMap,
  loading: "hourglass-outline" as keyof typeof Ionicons.glyphMap,
} as const;

// ============================================================================
// FUNÇÕES
// ============================================================================

// Retorna o ícone para um tipo de tarefa
export function getTaskStatusIcon(
  type: TaskStatus,
): keyof typeof Ionicons.glyphMap {
  return TASK_STATUS_ICONS[type] || "help-circle-outline";
}

// Retorna o ícone de navegação baseado no estado
export function getNavigationIcon(
  screen: keyof typeof NAVIGATION_ICONS,
  focused: boolean,
): keyof typeof Ionicons.glyphMap {
  const icons = NAVIGATION_ICONS[screen];
  return focused ? icons.focused : icons.unfocused;
}
