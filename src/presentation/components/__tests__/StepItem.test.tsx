import { StepItem } from "@/presentation/components/StepItem";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

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
    stepItem: {
      toggleLabelPrefix: "Marcar passo",
      asCompleted: "concluído",
      asNotCompleted: "não concluído",
      titleLabelPrefix: "Título do passo",
    },
  }),
}));

describe("StepItem", () => {
  it("renders accessible toggle label and triggers callback", () => {
    const step = {
      id: "step-1",
      title: "Beber água",
      isCompleted: false,
      order: 1,
    };

    const onToggleComplete = jest.fn();

    const { getByLabelText } = render(
      <StepItem step={step} onToggleComplete={onToggleComplete} />,
    );

    fireEvent.press(getByLabelText("Marcar passo Beber água concluído"));

    expect(onToggleComplete).toHaveBeenCalledWith("step-1");
  });
});
