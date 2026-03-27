import { ConfirmModal } from "@/presentation/components/ConfirmModal";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/presentation/hooks/usePreferences", () => ({
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
    common: {
      confirm: "Confirmar",
      cancel: "Cancelar",
    },
  }),
}));

describe("ConfirmModal", () => {
  it("renders localized default action labels and triggers callbacks", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const { getByText } = render(
      <ConfirmModal
        visible
        title="Confirmar exclusão"
        message="Deseja continuar?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    fireEvent.press(getByText("Confirmar"));
    fireEvent.press(getByText("Cancelar"));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders custom action labels when provided", () => {
    const { getByText } = render(
      <ConfirmModal
        visible
        title="Confirmar conclusão"
        message="Concluir tarefa agora?"
        confirmText="Concluir"
        cancelText="Voltar"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(getByText("Concluir")).toBeTruthy();
    expect(getByText("Voltar")).toBeTruthy();
  });
});
