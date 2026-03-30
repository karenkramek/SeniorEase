import CreateTaskScreen from "../(app)/create-task";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockCreateTask = jest.fn();
const mockShowNotification = jest.fn();
const mockBack = jest.fn();

jest.mock("@/presentation/hooks/useTasks", () => ({
  useTasks: () => ({
    createTask: mockCreateTask,
  }),
}));

jest.mock("@/presentation/hooks/useNotification", () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: () => true,
  }),
}));

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
    createTask: {
      screenLabel: "Tela de criação de tarefa",
      titleLabel: "Título da tarefa *",
      titlePlaceholder: "Título da tarefa",
      titleFieldLabel: "Campo para título da tarefa",
      titleRequiredHint: "Campo obrigatório",
      descriptionLabel: "Descrição da tarefa (opcional)",
      descriptionPlaceholder: "Descrição (opcional)",
      descriptionFieldLabel: "Campo para descrição da tarefa",
      createButton: "Criar Tarefa",
      createButtonA11y: "Botão para criar tarefa",
      titleRequiredError: "Informe um título para criar a tarefa.",
      createSuccess: "Tarefa criada com sucesso.",
      createError: "Não foi possível criar a tarefa.",
      createErrorDetail: "Não foi possível criar a tarefa agora. Tente novamente.",
    },
    taskList: {
      addIconA11y: "Ícone de adicionar",
    },
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

    fireEvent.press(getAllByLabelText("Botão para criar tarefa")[0]);

    expect(await findByText("Informe um título para criar a tarefa.")).toBeTruthy();
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("submits valid task and shows success notification", async () => {
    mockCreateTask.mockResolvedValueOnce(undefined);

    const { getAllByLabelText, getByPlaceholderText } = render(<CreateTaskScreen />);

    fireEvent.changeText(getByPlaceholderText("Título da tarefa"), "Consulta médica");
    fireEvent.changeText(getByPlaceholderText("Descrição (opcional)"), "Levar exames");
    fireEvent.press(getAllByLabelText("Botão para criar tarefa")[0]);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: "Consulta médica",
        description: "Levar exames",
      });
    });

    expect(mockShowNotification).toHaveBeenCalledWith("Tarefa criada com sucesso.", "success");
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
