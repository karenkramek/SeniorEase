import { AccessibleText } from "@/presentation/components/ui/text/AccessibleText";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { useTheme } from "@/presentation/hooks/useTheme";
import { DueDateStatus } from "@/presentation/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export type BadgeStatus = DueDateStatus | "completed";

interface DueDateBadgeProps {
  status: BadgeStatus;
  size?: "sm" | "md";
}

export function DueDateBadge({ status, size = "sm" }: DueDateBadgeProps) {
  const { themeColors } = useTheme();
  const { dueDateStatus: strings } = useAppStrings();

  if (!status) return null;

  const configs: Record<
    NonNullable<BadgeStatus>,
    {
      label: string;
      a11y: string;
      color: string;
      icon: React.ComponentProps<typeof Ionicons>["name"];
    }
  > = {
    completed: {
      label: strings.completedLabel,
      a11y: strings.completedA11y,
      color: themeColors.success,
      icon: "checkmark-circle",
    },
    overdue: {
      label: strings.overdueLabel,
      a11y: strings.overdueA11y,
      color: themeColors.error,
      icon: "alert-circle",
    },
    today: {
      label: strings.todayLabel,
      a11y: strings.todayA11y,
      color: themeColors.warning,
      icon: "time",
    },
    soon: {
      label: strings.soonLabel,
      a11y: strings.soonA11y,
      color: themeColors.icon,
      icon: "calendar-outline",
    },
  };

  const config = configs[status];
  const iconSize = size === "sm" ? 12 : 14;
  const fontSize = size === "sm" ? 11 : 13;

  return (
    <View
      accessible
      accessibilityLabel={config.a11y}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: config.color + "20",
        borderWidth: 1,
        borderColor: config.color + "60",
        borderRadius: 20,
        paddingHorizontal: size === "sm" ? 6 : 8,
        paddingVertical: size === "sm" ? 2 : 4,
        alignSelf: "flex-start",
        flexShrink: 0,
      }}
    >
      <Ionicons
        name={config.icon}
        size={iconSize}
        color={config.color}
        accessibilityElementsHidden
      />
      <AccessibleText
        style={{
          color: config.color,
          fontSize,
          fontWeight: "600",
        }}
        numberOfLines={1}
        accessibilityElementsHidden
      >
        {config.label}
      </AccessibleText>
    </View>
  );
}
