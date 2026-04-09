/// <reference types="jest" />
import type { Task } from "@/domain/entities/Task";
import { TaskStatus } from "@/domain/enums/TaskStatus";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import EditTaskScreen from "../(app)/edit-task";

const mockEditTask = jest.fn();
const mockShowNotification = jest.fn();
const mockBack = jest.fn();

const mockExistingTask: Task = {
  id: "t1",
  userId: "u1",
  title: "Consulta médica",
  description: "Levar exames",
  status: TaskStatus.PENDING,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, canGoBack: () => true }),
  useLocalSearchParams: () => ({ taskId: "t1" }),
}));

jest.mock("@/presentation/contexts/TaskRepositoryContext", () => ({
  useTaskRepository: () => ({
    findById: jest.fn().mockResolvedValue(mockExistingTask),
  }),
}));

jest.mock("@/presentation/hooks/useTaskActions", () => ({
  useTaskActions: () => ({
    createTask: jest.fn(),
    editTask: mockEditTask,
    completeTask: jest.fn(),
    uncompleteTask: jest.fn(),
    deleteTask: jest.fn(),
  }),
}));

jest.mock("@/presentation/hooks/useNotification", () => ({
  useNotification: () => ({ showNotification: mockShowNotification }),
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

describe("EditTaskScreen", () => {
  beforeEach(() => {
    mockEditTask.mockReset();
    mockShowNotification.mockReset();
    mockBack.mockReset();
  });

  it("pré-preenche os campos com os dados da tarefa carregada", async () => {
    const { getByDisplayValue } = render(<EditTaskScreen />);

    await waitFor(() => {
      expect(getByDisplayValue("Consulta médica")).toBeTruthy();
    });
    expect(getByDisplayValue("Levar exames")).toBeTruthy();
  });

  it("salva a tarefa editada e exibe notificação de sucesso", async () => {
    mockEditTask.mockResolvedValueOnce(undefined);

    const { getByDisplayValue, getAllByLabelText } = render(<EditTaskScreen />);

    await waitFor(() => {
      expect(getByDisplayValue("Consulta médica")).toBeTruthy();
    });

    fireEvent.changeText(
      getByDisplayValue("Consulta médica"),
      "Consulta revisada",
    );
    fireEvent.press(
      getAllByLabelText("Botão para salvar alterações da tarefa")[0],
    );

    await waitFor(() => {
      expect(mockEditTask).toHaveBeenCalledWith(
        "t1",
        expect.objectContaining({ title: "Consulta revisada" }),
      );
    });

    expect(mockShowNotification).toHaveBeenCalledWith(
      "Tarefa atualizada com sucesso.",
      "success",
    );

    await waitFor(
      () => {
        expect(mockBack).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );
  });

  it("exibe erro ao tentar salvar com título vazio", async () => {
    const { getByDisplayValue, getAllByLabelText, findByText } = render(
      <EditTaskScreen />,
    );

    await waitFor(() => {
      expect(getByDisplayValue("Consulta médica")).toBeTruthy();
    });

    fireEvent.changeText(getByDisplayValue("Consulta médica"), "");
    fireEvent.press(
      getAllByLabelText("Botão para salvar alterações da tarefa")[0],
    );

    expect(
      await findByText("Informe um título para criar a tarefa."),
    ).toBeTruthy();
    expect(mockEditTask).not.toHaveBeenCalled();
  });
});
