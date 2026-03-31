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
