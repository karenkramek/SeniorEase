import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

// Formata data no formato brasileiro (ex: "15/01/2024")
export const formatDate = (
  date: Date,
  formatString: string = "dd/MM/yyyy",
): string => {
  if (!date || !isValid(date)) {
    return "";
  }
  try {
    return format(date, formatString, { locale: ptBR });
  } catch (error) {
    console.warn("Erro ao formatar data:", error);
    return "";
  }
};

// Formata data por extenso (ex: "15 de janeiro de 2024")
export const formatDateLong = (date: Date): string => {
  if (!date || !isValid(date)) {
    return "";
  }
  try {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.warn("Erro ao formatar data longa:", error);
    return "";
  }
};

// Retorna "Hoje", "Ontem" ou data por extenso (ex: "8 de janeiro")
export const formatDateRelative = (date: Date): string => {
  if (!date || !isValid(date)) {
    return "";
  }
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = format(date, "yyyy-MM-dd");
    const nowStr = format(now, "yyyy-MM-dd");
    const yesterdayStr = format(yesterday, "yyyy-MM-dd");

    if (dateStr === nowStr) return "Hoje";
    if (dateStr === yesterdayStr) return "Ontem";
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  } catch (error) {
    console.warn("Erro ao formatar data relativa:", error);
    return "";
  }
};

// Formata data para inputs (ex: "15/01/2024" ou placeholder se null)
export const formatDateInput = (
  date: Date | null,
  placeholder: string = "Selecionar",
): string => {
  if (!date || !isValid(date)) {
    return placeholder;
  }
  try {
    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    console.warn("Erro ao formatar data input:", error);
    return placeholder;
  }
};

// Status da data de vencimento (timezone-safe, usa componentes locais)
export type DueDateStatus = "overdue" | "today" | "soon" | "upcoming" | null;

export function getDueDateStatus(dueDate?: string): DueDateStatus {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  if (!isValid(date)) return null;

  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  const dueY = date.getFullYear();
  const dueM = date.getMonth();
  const dueD = date.getDate();

  // Compara apenas a parte da data (ignora horário)
  const todayStart = new Date(todayY, todayM, todayD).getTime();
  const dueStart = new Date(dueY, dueM, dueD).getTime();
  const soonLimit = new Date(todayY, todayM, todayD + 3).getTime();

  if (dueStart < todayStart) return "overdue";
  if (dueStart === todayStart) return "today";
  if (dueStart <= soonLimit) return "soon";
  return "upcoming";
}
