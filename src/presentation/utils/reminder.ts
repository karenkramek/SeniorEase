export function getReminderMessage(taskTitle: string, dueDate: string): string {
  const date = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 1) {
    return `Lembrete:\nSua tarefa "${taskTitle}" vence amanhã.`;
  } else if (diffDays === 0) {
    return `Lembrete:\nSua tarefa "${taskTitle}" vence hoje.`;
  } else if (diffDays > 1) {
    return `Lembrete:\nSua tarefa "${taskTitle}" vence em ${diffDays} dias.`;
  } else {
    return `Lembrete:\nSua tarefa "${taskTitle}" já venceu.`;
  }
}
