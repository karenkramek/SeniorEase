import { Step } from "@/domain/entities/Step";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { usePreferences } from "@/presentation/contexts/PreferencesContext";
import { Colors } from "@/presentation/theme/colors";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface StepItemProps {
  step: Step;
  onToggleComplete: (stepId: string) => void;
}

export function StepItem({ step, onToggleComplete }: StepItemProps) {
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
      accessibilityLabel={`Marcar passo ${step.title} como ${step.isCompleted ? "não concluído" : "concluído"}`}
      accessibilityRole="button"
    >
      <Ionicons
        name={step.isCompleted ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={themeColors.icon}
        accessibilityLabel={
          step.isCompleted ? "Passo concluído" : "Passo não concluído"
        }
      />
      <AccessibleText
        style={textStyle}
        accessibilityLabel={`Título do passo: ${step.title}`}
      >
        {step.title}
      </AccessibleText>
    </TouchableOpacity>
  );
}
