/// <reference types="jest" />
import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () =>
	require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const mockPreferences = {
	fontSizeMultiplier: 1,
	isHighContrast: false,
	spacingMultiplier: 1,
	isSimplifiedMode: false,
	useExtraConfirmation: false,
	theme: "light" as const,
};

jest.mock("@/presentation/hooks/usePreferences", () => ({
	usePreferences: () => ({
		preferences: mockPreferences,
		isLoading: false,
		errorMessage: null,
		updatePreferences: jest.fn(),
		clearErrorMessage: jest.fn(),
	}),
}));

jest.mock("@/presentation/contexts/PreferencesContext", () => ({
	usePreferences: () => ({
		preferences: mockPreferences,
		isLoading: false,
		errorMessage: null,
		updatePreferences: jest.fn(),
		clearErrorMessage: jest.fn(),
	}),
}));

jest.mock("@/presentation/hooks/useTheme", () => ({
	useTheme: () => ({
		themeColors: {
			text: "#1C1917",
			background: "#F5F0E8",
			tint: "#0F766E",
			icon: "#115E59",
			tabIconDefault: "#78716C",
			tabIconSelected: "#0F766E",
			success: "#047857",
			error: "#B91C1C",
			warning: "#C2410C",
			buttonText: "#FFFFFF",
			switchTrackOff: "#A8A29E",
			switchTrackOn: "#0F766E",
			switchThumbOff: "#FFFFFF",
			switchThumbOn: "#FFFFFF",
		},
		colorScheme: "light",
		preferences: mockPreferences,
		isWeb: false,
	}),
}));

jest.mock("@expo/vector-icons", () => {
	const React = require("react");
	const { Text } = require("react-native");
	const MockIcon = ({ name }: { name: string }) => React.createElement(Text, null, name);

	return {
		Ionicons: MockIcon,
		MaterialIcons: MockIcon,
	};
});

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	}),
	SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
	SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

const mockAppStrings = {
	common: {
		confirm: "Confirmar",
		cancel: "Cancelar",
		ok: "OK",
		close: "Fechar",
		closeMessage: "Fechar mensagem",
		notPossibleNow:
			"Não foi possível concluir a operação agora. Tente novamente.",
		appTitle: "SeniorEase",
		emailLabel: "E-mail",
		passwordLabel: "Senha",
		nameLabel: "Nome completo",
		showPasswordA11y: "Mostrar senha",
		hidePasswordA11y: "Ocultar senha",
		emailInvalidError: "Por favor, insira um e-mail válido.",
		passwordMinError: "A senha deve ter pelo menos 6 caracteres.",
		titleA11yPrefix: "Título",
		taskCompletedA11y: "Tarefa concluída",
		deleteAction: "Excluir",
		togglePasswordHint: "Alternar visibilidade da senha",
	},
	createTask: {
		screenLabel: "Nova tarefa",
		titleLabel: "Título da tarefa *",
		titleFieldLabel: "Título da tarefa",
		titleFieldA11yHint: "Digite o título da tarefa, este campo é obrigatório",
		titleRequiredHint: "Campo obrigatório",
		descriptionLabel: "Descrição da tarefa (opcional)",
		descriptionPlaceholder: "Descrição (opcional)",
		descriptionFieldA11yLabel: "Descrição da tarefa",
		descriptionFieldA11yHint: "Digite detalhes opcionais sobre a tarefa",
		createButton: "Criar Tarefa",
		createButtonA11y: "Botão para criar tarefa",
		cancelButton: "Cancelar",
		titleRequiredError: "Informe um título para criar a tarefa.",
		createSuccess: "Tarefa criada com sucesso.",
		createError: "Não foi possível criar a tarefa.",
		createErrorDetail:
			"Não foi possível criar a tarefa agora. Tente novamente.",
		dueDateLabel: "Data de Vencimento (opcional)",
		dueDateA11yLabel: "Data de vencimento da tarefa",
		dueDateA11yHintSelected: "Data selecionada",
		dueDateA11yHintNone: "nenhuma",
		dueDateA11yHintAction: "Toque para abrir o seletor de data",
		dueDatePlaceholder: "Selecione uma data",
		dueDateInvalidError: "Data de vencimento inválida",
	},
	taskList: {
		addIconA11y: "Ícone de adicionar",
	},
	datePicker: {
		title: "Selecionar data",
		dayLabel: "Dia",
		selectDayA11y: "Selecionar dia",
		monthLabel: "Mês",
		selectMonthA11y: "Selecionar mês",
		yearLabel: "Ano",
		selectYearA11y: "Selecionar ano",
		cancelA11y: "Cancelar seleção de data",
		confirmA11y: "Confirmar data selecionada",
	},
};

jest.mock("@/presentation/hooks/useAppStrings", () => ({
	useAppStrings: () => mockAppStrings,
}));
