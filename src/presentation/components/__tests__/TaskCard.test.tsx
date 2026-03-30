import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { TaskCard } from "@/presentation/components/TaskCard";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";

jest.mock("@/presentation/contexts/PreferencesContext", () => ({
  usePreferences: () => ({
    preferences: {
      fontSizeMultiplier: 1,
      isHighContrast: false,
      spacingMultiplier: 1,
      isSimplifiedMode: false,
      useExtraConfirmation: false,
      theme: "light",
    },
  }),
}));

jest.mock("@/presentation/hooks/useAppStrings", () => ({
  useAppStrings: () => ({
    taskCard: {
      cardLabelPrefix: "Cartão da tarefa",
      completedA11y: "Tarefa concluída",
      markCompletedA11y: "Marcar como concluída",
      titleLabelPrefix: "Título da tarefa",
      dueDatePrefix: "Vencimento",
      dueDateLabelPrefix: "Vencimento",
      deleteTaskA11yPrefix: "Excluir tarefa",
      deleteAction: "Excluir",
    },
  }),
}));

describe("TaskCard", () => {
  const task: Task = {
    id: "task-1",
    userId: "user-1",
    title: "Tomar remédio",
    dueDate: "2026-03-24T00:00:00.000Z",
    status: TaskStatus.PENDING,
    createdAt: "2026-03-24T00:00:00.000Z",
    updatedAt: "2026-03-24T00:00:00.000Z",
  };

  beforeEach(() => {
    jest.spyOn(Animated, "timing").mockReturnValue({
      start: (cb?: () => void) => cb?.(),
    } as unknown as Animated.CompositeAnimation);

    jest.spyOn(Animated, "sequence").mockReturnValue({
      start: (cb?: () => void) => cb?.(),
    } as unknown as Animated.CompositeAnimation);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exposes accessibility labels and triggers toggle/delete actions", () => {
    const onToggleComplete = jest.fn();
    const onDelete = jest.fn();

    const { getByLabelText } = render(
      <TaskCard task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} />,
    );

    fireEvent.press(getByLabelText("Marcar como concluída"));
    fireEvent.press(getByLabelText("Excluir tarefa: Tomar remédio"));

    expect(onToggleComplete).toHaveBeenCalledWith("task-1", true);
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });
});
