/// <reference types="jest" />
import { GlobalNotification } from "@/presentation/components/ui/common/GlobalNotification";
import type { AppNotification } from "@/presentation/contexts/NotificationContext";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";

const mockClearNotification = jest.fn();
let mockNotificationState: AppNotification | null = null;

jest.mock("@/presentation/contexts/NotificationContext", () => ({
  useNotification: () => ({
    notification: mockNotificationState,
    clearNotification: mockClearNotification,
    showNotification: jest.fn(),
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

jest.mock("@/presentation/hooks/useAppStrings", () => ({
  useAppStrings: () => ({
    notifications: {
      closeA11y: "Fechar notificação",
    },
  }),
}));

describe("GlobalNotification", () => {
  beforeEach(() => {
    mockClearNotification.mockClear();

    jest.spyOn(Animated, "spring").mockReturnValue({
      start: (cb?: () => void) => cb?.(),
    } as unknown as Animated.CompositeAnimation);

    jest.spyOn(Animated, "timing").mockReturnValue({
      start: (cb?: () => void) => cb?.(),
    } as unknown as Animated.CompositeAnimation);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockNotificationState = null;
  });

  it("renders nothing when there is no notification", () => {
    const { queryByText } = render(<GlobalNotification />);

    expect(queryByText("Tarefa criada com sucesso.")).toBeNull();
  });

  it("renders notification as alert and closes on dismiss action", () => {
    mockNotificationState = {
      message: "Tarefa criada com sucesso.",
      type: "success",
    };

    const { getByText, getByLabelText } = render(<GlobalNotification />);

    expect(getByText("Tarefa criada com sucesso.")).toBeTruthy();

    fireEvent.press(getByLabelText("Fechar notificação"));

    expect(mockClearNotification).toHaveBeenCalledTimes(1);
  });
});
