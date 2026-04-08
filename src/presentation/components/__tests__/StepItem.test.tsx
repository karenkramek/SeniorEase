/// <reference types="jest" />
import { StepItem } from "@/presentation/components/StepItem";
import { fireEvent, render } from "@testing-library/react-native";
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
