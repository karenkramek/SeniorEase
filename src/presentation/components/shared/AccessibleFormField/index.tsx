import { ThemedText } from "@/presentation/components/ui/text/ThemedText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { A11yTokens } from "@/presentation/theme/a11y-tokens";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  AccessibilityRole,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface AccessibleFormFieldProps extends TextInputProps {
  fieldId: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  labelComponent?: React.ReactNode;
  iconComponent?: React.ReactNode;
  inputContainerStyle?: ViewStyle;
  borderColorDefault?: string;
  onFieldStateChange?: (isDirty: boolean, isValid: boolean) => void;
}

const AccessibleErrorMessage: React.FC<{
  message: string;
  fieldId: string;
}> = ({ message, fieldId }) => (
  <View
    nativeID={`error-${fieldId}`}
    accessibilityRole="alert"
    accessible
    {...({
      "aria-live": "assertive",
      "aria-atomic": "true",
      role: "alert",
    } as any)}
    style={styles.errorContainer}
  >
    <Ionicons
      name="alert-circle"
      size={16}
      color={A11yTokens.error.color}
      style={{ marginRight: 4 }}
    />
    <ThemedText style={styles.errorText}>{message}</ThemedText>
  </View>
);

/**
 * Main AccessibleFormField component
 */
export const AccessibleFormField = React.forwardRef<
  TextInput,
  AccessibleFormFieldProps
>(
  (
    {
      fieldId,
      accessibilityLabel,
      accessibilityHint,
      error,
      required = false,
      containerStyle,
      labelComponent,
      inputContainerStyle,
      iconComponent,
      borderColorDefault,
      onFieldStateChange,
      style,
      onChangeText,
      onBlur,
      onFocus,
      value,
      ...restProps
    },
    ref,
  ) => {
    // Get theme to determine border color based on dark/light mode
    const { themeColors, colorScheme, preferences } = useTheme();

    // Determine default border color based on theme mode
    const defaultBorderColor =
      borderColorDefault ??
      (colorScheme === "dark" ? themeColors.text : themeColors.tint);

    // Compute accessibility label with required indicator
    const computedA11yLabel = useMemo(() => {
      const label = accessibilityLabel;
      const requiredSuffix = required ? ", required" : "";
      const errorSuffix = error ? `, error: ${error}` : "";
      return `${label}${requiredSuffix}${errorSuffix}`;
    }, [accessibilityLabel, required, error]);

    // Compute accessibility hint with instructions
    const computedA11yHint = useMemo(() => {
      const hints = [];
      if (accessibilityHint) hints.push(accessibilityHint);
      if (error) hints.push(`Error: ${error}`);
      if (required) hints.push("This field is required");
      return hints.join(". ");
    }, [accessibilityHint, error, required]);

    // Track field state changes
    const handleChangeText = (text: string) => {
      const isDirty = text.length > 0;
      const isValid = !error;
      onFieldStateChange?.(isDirty, isValid);
      onChangeText?.(text);
    };

    // Announce focus state to screen readers
    const handleFocus = () => {
      onFocus?.({ nativeEvent: { text: value || "" } } as any);
    };

    const handleBlur = () => {
      onBlur?.({ nativeEvent: { text: value || "" } } as any);
    };

    // Determine input container border color based on error state
    const inputContainerBorderColor = error
      ? A11yTokens.error.color
      : defaultBorderColor;

    // Determine border radius - smaller for multiline inputs (textareas)
    const containerBorderRadius = 12;

    // Theme-aware dynamic colors for the form field
    const inputBgColor = preferences.isHighContrast
      ? themeColors.background
      : colorScheme === "dark"
        ? themeColors.background
        : "#F8F9FA";
    const inputErrorBgColor = preferences.isHighContrast
      ? themeColors.background
      : colorScheme === "dark"
        ? themeColors.background
        : "#FFF5F5";
    const inputTextColor = themeColors.text;

    return (
      <View style={[styles.container, containerStyle]}>
        {labelComponent && (
          <View style={styles.labelWrapper}>{labelComponent}</View>
        )}

        <View
          style={[
            styles.inputContainer,
            inputContainerStyle,
            {
              borderColor: inputContainerBorderColor,
              borderRadius: containerBorderRadius,
              backgroundColor: inputBgColor,
            },
            error && {
              borderColor: A11yTokens.error.color,
              backgroundColor: inputErrorBgColor,
            },
          ]}
          accessible={false}
        >
          {iconComponent && (
            <View style={styles.iconWrapper}>{iconComponent}</View>
          )}

          <TextInput
            ref={ref}
            style={[styles.input, { color: inputTextColor }, style]}
            {...(Platform.OS === "web"
              ? {
                  // Web: add semantic HTML attributes via react-native-web
                  "aria-label": computedA11yLabel as any,
                  "aria-invalid": error ? "true" : "false",
                  "aria-required": required ? "true" : "false",
                  "aria-describedby": error ? `error-${fieldId}` : undefined,
                }
              : {
                  // Native: use accessibility props
                  accessibilityLabel: computedA11yLabel,
                  accessibilityHint: computedA11yHint,
                  accessibilityRole: "none" as AccessibilityRole,
                })}
            nativeID={`input-${fieldId}`}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!restProps.editable === false ? true : restProps.editable}
            {...restProps}
          />
        </View>

        {error && <AccessibleErrorMessage message={error} fieldId={fieldId} />}
      </View>
    );
  },
);

AccessibleFormField.displayName = "AccessibleFormField";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelWrapper: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 5,
    minHeight: 53,
    paddingVertical: 2,
  },
  iconWrapper: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  errorContainer: {
    marginTop: 8,
    paddingHorizontal: 0,
    paddingVertical: 6,
    backgroundColor: "transparent",
    borderLeftWidth: 0,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: A11yTokens.error.color,
    fontSize: 13,
    fontWeight: "500",
  },
});
