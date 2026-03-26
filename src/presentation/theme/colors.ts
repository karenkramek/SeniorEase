import { TaskStatus } from "@/domain/enums/TaskStatus";

export const Colors = {
  light: {
    text: "#1F2933",
    background: "#F5F7FA",
    tint: "#1F4E79",
    icon: "#1F4E79",
    tabIconDefault: "#9AA5B1",
    tabIconSelected: "#1F4E79",
    success: "#2F7D32",
    error: "#C53030",
    warning: "#E67E22",
    buttonText: "#FFFFFF",
  },

  dark: {
    text: "#E4E7EB",
    background: "#121417",
    tint: "#6FA8DC",
    icon: "#6FA8DC",
    tabIconDefault: "#7B8794",
    tabIconSelected: "#6FA8DC",
    success: "#66BB6A",
    error: "#E57373",
    warning: "#FFB74D",
    buttonText: "#121417",
  },

  highContrast: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#FFD400",
    icon: "#FFFFFF",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: "#FFD400",
    success: "#00FF00",
    error: "#FF0000",
    warning: "#FFD400",
    buttonText: "#000000",
  },
};

export const TaskStatusColors: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "#FF8C42", // Laranja
  [TaskStatus.COMPLETED]: "#00D4AA", // Verde
};

// Retorna a cor correspondente ao status da tarefa
export function getTaskStatusColor(status: TaskStatus): string {
  return TaskStatusColors[status] || "#95a5a6";
}

// Converte cor hex para rgba com opacidade
export function getColorWithOpacity(color: string, opacity: number): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
