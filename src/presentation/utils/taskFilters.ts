/**
 * Utilitários de filtragem e ordenação de tarefas
 * Fornece filtros avançados, ordenação e extração de dados
 */

import { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface FilterOptions {
  dateFrom: Date | null;
  dateTo: Date | null;
  status: TaskStatus[];
  sortBy: "date-desc" | "date-asc";
}

interface FilterTasksParams {
  tasks: Task[];
  filters: FilterOptions;
  searchQuery?: string;
}

// ============================================================================
// FILTRAGEM DE TAREFAS
// ============================================================================

// Aplica todos os filtros configurados em uma lista de tarefas
export function filterTasks({
  tasks,
  filters,
  searchQuery = "",
}: FilterTasksParams): Task[] {
  let filtered = [...tasks];

  // Date range filters
  if (filters.dateFrom) {
    filtered = filtered.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      const fromDate = new Date(filters.dateFrom!);
      fromDate.setHours(0, 0, 0, 0);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    filtered = filtered.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      const toDate = new Date(filters.dateTo!);
      toDate.setHours(23, 59, 59, 999);
      return taskDate <= toDate;
    });
  }

  // Status filters
  if (filters.status.length > 0) {
    filtered = filtered.filter((t) =>
      filters.status.includes(t.status as TaskStatus),
    );
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((t) => t.title.toLowerCase().includes(query));
  }

  return filtered;
}

// ============================================================================
// ORDENAÇÃO DE TAREFAS
// ============================================================================

// Ordena tarefas baseado no critério especificado (por data de criação)
export function sortTasks(
  tasks: Task[],
  sortBy: FilterOptions["sortBy"],
): Task[] {
  const sorted = [...tasks];

  switch (sortBy) {
    case "date-desc":
      // Mais recentes primeiro (criadas mais recentemente)
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      break;
    case "date-asc":
      // Mais antigas primeiro (criadas primeiro)
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA.getTime() - dateB.getTime();
      });
      break;
  }

  return sorted;
}

// ============================================================================
// UTILITÁRIOS DE FILTROS
// ============================================================================

// Verifica se há filtros avançados ativos
export function hasActiveFilters(filters: FilterOptions): boolean {
  return (
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.status.length > 0 ||
    filters.sortBy !== "date-desc"
  );
}
