/// <reference types="jest" />
import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { TaskCard } from "@/presentation/components/TaskCard";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";

jest.mock("@/presentation/hooks/useTheme", () => ({
  useTheme: () => ({
    themeColors: {
      background: "#ffffff",
      text: "#000000",
      tint: "#007aff",
      icon: "#8e8e93",
      success: "#34c759",
      error: "#ff3b30",
      warning: "#ff9500",
      buttonText: "#ffffff",
    },
    preferences: {
      fontSizeMultiplier: 1,
      isHighContrast: false,
      spacingMultiplier: 1,
      useExtraConfirmation: false,
      confirmOnComplete: false,
      theme: "light",
    },
    isWeb: false,
    colorScheme: "light",
  }),
}));

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  default: () => ({ width: 390, height: 844 }),
}));

jest.mock("@/presentation/hooks/useAppStrings", () => ({
  useAppStrings: () => ({
    common: {
      taskCompletedA11y: "Tarefa concluída",
      deleteAction: "Excluir",
    },
    taskCard: {
      cardLabelPrefix: "Cartão da tarefa",
      markCompletedA11y: "Marcar como concluída",
      titleLabelPrefix: "Título da tarefa",
      dueDatePrefix: "Vencimento",
      deleteTaskA11yPrefix: "Excluir tarefa",
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
