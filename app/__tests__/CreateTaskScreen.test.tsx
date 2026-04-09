/// <reference types="jest" />
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import CreateTaskScreen from "../(app)/create-task";

const mockCreateTask = jest.fn();
const mockShowNotification = jest.fn();
const mockBack = jest.fn();

jest.mock("@/presentation/hooks/useTaskActions", () => ({
  useTaskActions: () => ({
    createTask: mockCreateTask,
    editTask: jest.fn(),
    completeTask: jest.fn(),
    uncompleteTask: jest.fn(),
    deleteTask: jest.fn(),
  }),
}));

jest.mock("@/presentation/hooks/useNotification", () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
  }),
}));

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

jest.mock("@/presentation/hooks/useButtonHeight", () => ({
  useButtonHeight: () => 48,
}));

jest.mock("@/presentation/hooks/useAppStrings", () => ({
  useAppStrings: () => ({
    common: {
      taskCompletedA11y: "Tarefa concluída",
      deleteAction: "Excluir",
      cancel: "Cancelar",
      confirm: "Confirmar",
      close: "Fechar",
    },
    createTask: {
      screenLabel: "Adicionar Tarefa",
      titleLabel: "Título da tarefa *",
      titleFieldLabel: "Título da tarefa",
      titleFieldA11yHint: "Digite o título da tarefa, este campo é obrigatório",
      titleRequiredError: "Informe um título para criar a tarefa.",
      descriptionLabel: "Descrição da tarefa (opcional)",
      descriptionFieldA11yLabel: "Descrição da tarefa",
      descriptionFieldA11yHint: "Digite detalhes opcionais sobre a tarefa",
      descriptionPlaceholder: "Descrição (opcional)",
      dueDateLabel: "Data de Vencimento (opcional)",
      dueDateA11yLabel: "Data de vencimento da tarefa",
      dueDateA11yHintSelected: "Data selecionada",
      dueDateA11yHintNone: "nenhuma",
      dueDateA11yHintAction: "Toque para abrir o seletor de data",
      dueDatePlaceholder: "Selecione uma data",
      dueDateInvalidError: "Data de vencimento inválida",
      createButton: "Adicionar Tarefa",
      createButtonA11y: "Botão para adicionar tarefa",
      cancelButton: "Cancelar",
      createSuccess: "Tarefa criada com sucesso.",
      createError: "Não foi possível criar a tarefa.",
      createErrorDetail: "Tente novamente mais tarde.",
    },
    editTask: {
      screenLabel: "Editar tarefa",
      editButton: "Salvar",
      editButtonA11y: "Botão para salvar alterações da tarefa",
      editSuccess: "Tarefa atualizada com sucesso.",
      editError: "Não foi possível atualizar a tarefa.",
      editErrorDetail: "Tente novamente mais tarde.",
      completedTaskError: "Não é possível editar uma tarefa concluída.",
    },
    datePicker: {
      title: "Selecionar data",
      dayLabel: "Dia",
      monthLabel: "Mês",
      yearLabel: "Ano",
      selectDayA11y: "Selecionar dia",
      selectMonthA11y: "Selecionar mês",
      selectYearA11y: "Selecionar ano",
      selectButton: "Confirmar",
      selectButtonA11y: "Botão para confirmar data",
      cancelA11y: "Botão para cancelar",
    },
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: () => true,
  }),
}));

describe("CreateTaskScreen", () => {
  beforeEach(() => {
    mockCreateTask.mockReset();
    mockShowNotification.mockReset();
    mockBack.mockReset();
  });

  it("shows accessible required-title error when trying to submit empty form", async () => {
    const { getAllByLabelText, findByText } = render(<CreateTaskScreen />);

    fireEvent.press(getAllByLabelText("Botão para adicionar tarefa")[0]);

    expect(
      await findByText("Informe um título para criar a tarefa."),
    ).toBeTruthy();
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("submits valid task and shows success notification", async () => {
    mockCreateTask.mockResolvedValueOnce(undefined);

    const { getAllByLabelText, getByPlaceholderText } = render(
      <CreateTaskScreen />,
    );

    fireEvent.changeText(
      getByPlaceholderText("Título da tarefa"),
      "Consulta médica",
    );
    fireEvent.changeText(
      getByPlaceholderText("Descrição (opcional)"),
      "Levar exames",
    );
    fireEvent.press(getAllByLabelText("Botão para adicionar tarefa")[0]);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: "Consulta médica",
        description: "Levar exames",
      });
    });

    expect(mockShowNotification).toHaveBeenCalledWith(
      "Tarefa criada com sucesso.",
      "success",
    );

    await waitFor(
      () => {
        expect(mockBack).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );
  });
});
