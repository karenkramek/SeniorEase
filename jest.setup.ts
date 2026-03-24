import "@testing-library/jest-native/extend-expect";

jest.mock("@expo/vector-icons", () => {
	const React = require("react");
	const { Text } = require("react-native");
	const MockIcon = ({ name }: { name: string }) => React.createElement(Text, null, name);

	return {
		Ionicons: MockIcon,
		MaterialIcons: MockIcon,
	};
});
