import { AccessibleText } from "@/presentation/components/AccessibleText";
import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import { Colors } from "@/presentation/theme/colors";
import { sharedStyles } from "@/presentation/theme/sharedStyles";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface StepItemProps {
  step: Step;
  onToggleComplete: (stepId: string) => void;
}

interface Step {
  id: string;
  title: string;
  isCompleted: boolean;
  order: number;
}

export function StepItem({ step, onToggleComplete }: StepItemProps) {
  const appTexts = useAppStrings();
  const stepTexts = appTexts.stepItem;
  const { preferences } = usePreferences();
  const colorScheme = preferences.theme ?? "light";
  const themeColors = preferences.isHighContrast
    ? Colors.highContrast
    : Colors[colorScheme as "light" | "dark"];

  const textStyle = {
    flex: 1,
    marginLeft: Spacing.medium,
    textDecorationLine: step.isCompleted
      ? "line-through"
      : ("none" as "line-through" | "none"),
  };

  return (
    <TouchableOpacity
      onPress={() => onToggleComplete(step.id)}
      accessibilityLabel={`${stepTexts.toggleLabelPrefix} ${step.title} ${step.isCompleted ? stepTexts.asNotCompleted : stepTexts.asCompleted}`}
      accessibilityRole="button"
      style={[
        sharedStyles.touchTargetMin,
        {
          flexDirection: "row",
          alignItems: "center",
        },
      ]}
    >
      <View
        style={[
          sharedStyles.touchTargetMin,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Ionicons
          name={step.isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={themeColors.icon}
        />
      </View>
      <AccessibleText
        style={textStyle}
        accessibilityLabel={`${stepTexts.titleLabelPrefix}: ${step.title}`}
      >
        {step.title}
      </AccessibleText>
    </TouchableOpacity>
  );
}
