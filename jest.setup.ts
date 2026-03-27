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
			text: "#1F2933",
			background: "#F5F7FA",
			tint: "#1F4E79",
			icon: "#1F4E79",
			tabIconDefault: "#9AA5B1",
			tabIconSelected: "#1F4E79",
			success: "#2F7D32",
			error: "#C53030",
			warning: "#E67E22",
			buttonText: "#FFFFFF",
			switchTrackOff: "#9AA5B1",
			switchTrackOn: "#1F4E79",
			switchThumbOff: "#FFFFFF",
			switchThumbOn: "#FFFFFF",
		},
		colorScheme: "light",
		preferences: mockPreferences,
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
