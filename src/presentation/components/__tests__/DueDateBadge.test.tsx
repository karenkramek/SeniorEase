/// <reference types="jest" />
import { DueDateBadge } from "@/presentation/components/ui/common/DueDateBadge";
import { render } from "@testing-library/react-native";
import React from "react";

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

jest.mock("@/presentation/hooks/useAppStrings", () => ({
  useAppStrings: () => ({
    dueDateStatus: {
      completedLabel: "Concluída",
      completedA11y: "Tarefa concluída",
      overdueLabel: "Vencida",
      overdueA11y: "Tarefa vencida",
      todayLabel: "Vence hoje",
      todayA11y: "Tarefa vence hoje",
      soonLabel: "A vencer",
      soonA11y: "Tarefa a vencer",
    },
  }),
}));

// O texto do label é marcado com accessibilityElementsHidden no componente,
// pois o pai já carrega o accessibilityLabel completo. Por isso usamos
// includeHiddenElements para verificar o conteúdo visual do texto.
describe("DueDateBadge", () => {
  it('renderiza o badge "Concluída" com a11y correta', () => {
    const { getByLabelText, getByText } = render(
      <DueDateBadge status="completed" />,
    );
    expect(
      getByText("Concluída", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(getByLabelText("Tarefa concluída")).toBeTruthy();
  });

  it('renderiza o badge "Vencida" com a11y correta', () => {
    const { getByLabelText, getByText } = render(
      <DueDateBadge status="overdue" />,
    );
    expect(getByText("Vencida", { includeHiddenElements: true })).toBeTruthy();
    expect(getByLabelText("Tarefa vencida")).toBeTruthy();
  });

  it('renderiza o badge "Vence hoje" com a11y correta', () => {
    const { getByLabelText, getByText } = render(
      <DueDateBadge status="today" />,
    );
    expect(
      getByText("Vence hoje", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(getByLabelText("Tarefa vence hoje")).toBeTruthy();
  });

  it('renderiza o badge "A vencer" com a11y correta', () => {
    const { getByLabelText, getByText } = render(
      <DueDateBadge status="soon" />,
    );
    expect(getByText("A vencer", { includeHiddenElements: true })).toBeTruthy();
    expect(getByLabelText("Tarefa a vencer")).toBeTruthy();
  });
});
