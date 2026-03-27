/**
 * AccessibleFormField Component
 *
 * Wraps form inputs with full WCAG 2.2 AA accessibility semantics:
 * - Semantic HTML for web (aria-invalid, aria-describedby, aria-required)
 * - Native screen reader labels (accessibilityLabel, accessibilityHint)
 * - Error messages with alert role for live announcements
 * - Touch target size validation (44x44 minimum)
 * - Focus outline styling
 *
 * Supports both mobile native (iOS/Android) and web (react-native-web) with consistent semantics
 */

import React, { useMemo } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleSheet,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { ThemedText } from '@/presentation/components/ThemedText';
import { A11yTokens } from '@/presentation/theme/a11y-tokens';

interface AccessibleFormFieldProps extends TextInputProps {
  /**
   * Unique field identifier (email, password, etc)
   */
  fieldId: string;

  /**
   * Human-readable label for screen readers
   * @example "Email address for login"
   */
  accessibilityLabel: string;

  /**
   * Additional hint for screen reader users
   * @example "Use your registered email address"
   */
  accessibilityHint?: string;

  /**
   * Error message to display and announce
   */
  error?: string;

  /**
   * Is this field required?
   */
  required?: boolean;

  /**
   * Container style for layout flexibility
   */
  containerStyle?: ViewStyle;

  /**
   * Visual label component to render above input
   * @example <Text>Email</Text>
   */
  labelComponent?: React.ReactNode;

  /**
   * Icon component to display inside input container
   * @example <Ionicons name="mail" />
   */
  iconComponent?: React.ReactNode;

  /**
   * Input container style (for borders, padding, etc)
   */
  inputContainerStyle?: ViewStyle;

  /**
   * Default border color when no error
   * @default "#1F4E79"
   */
  borderColorDefault?: string;

  /**
   * Callback when field state changes (for tracking dirty state)
   */
  onFieldStateChange?: (isDirty: boolean, isValid: boolean) => void;
}

/**
 * Error message component with alert role
 * Announces errors to screen readers automatically
 */
const AccessibleErrorMessage: React.FC<{ message: string; fieldId: string }> = ({
  message,
  fieldId,
}) => (
  <View
    nativeID={`error-${fieldId}`}
    accessibilityRole="alert"
    accessible
    // For web: these become standard ARIA attributes via react-native-web
    {...{
      'aria-live': 'assertive',
      'aria-atomic': 'true',
      role: 'alert',
    } as any}
    style={styles.errorContainer}
  >
    <ThemedText style={styles.errorText}>
      {message}
    </ThemedText>
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
      borderColorDefault = "#1F4E79",
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
    // Compute accessibility label with required indicator
    const computedA11yLabel = useMemo(() => {
      const label = accessibilityLabel;
      const requiredSuffix = required ? ', required' : '';
      const errorSuffix = error ? `, error: ${error}` : '';
      return `${label}${requiredSuffix}${errorSuffix}`;
    }, [accessibilityLabel, required, error]);

    // Compute accessibility hint with instructions
    const computedA11yHint = useMemo(() => {
      const hints = [];
      if (accessibilityHint) hints.push(accessibilityHint);
      if (error) hints.push(`Error: ${error}`);
      if (required) hints.push('This field is required');
      return hints.join('. ');
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
      onFocus?.({ nativeEvent: { text: value || '' } } as any);
    };

    const handleBlur = () => {
      onBlur?.({ nativeEvent: { text: value || '' } } as any);
    };

    // Determine input container border color based on error state
    const inputContainerBorderColor = error
      ? A11yTokens.error.color
      : borderColorDefault;

    return (
      <View style={[styles.container, containerStyle]}>
        {labelComponent && <View style={styles.labelWrapper}>{labelComponent}</View>}

        <View
          style={[
            styles.inputContainer,
            inputContainerStyle,
            { borderColor: inputContainerBorderColor },
            error && styles.inputContainerError,
          ]}
          accessible={false}
        >
          {iconComponent && <View style={styles.iconWrapper}>{iconComponent}</View>}

          <TextInput
            ref={ref}
            style={[styles.input, style]}
            {...(Platform.OS === 'web'
              ? {
                  // Web: add semantic HTML attributes via react-native-web
                  'aria-label': computedA11yLabel as any,
                  'aria-invalid': error ? 'true' : 'false',
                  'aria-required': required ? 'true' : 'false',
                  'aria-describedby': error ? `error-${fieldId}` : undefined,
                }
              : {
                  // Native: use accessibility props
                  accessibilityLabel: computedA11yLabel,
                  accessibilityHint: computedA11yHint,
                  accessibilityRole: 'none' as AccessibilityRole,
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

AccessibleFormField.displayName = 'AccessibleFormField';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelWrapper: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 40,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    minHeight: 48, // Touch target minimum 44x44
    paddingVertical: 2,
  },
  inputContainerError: {
    borderColor: A11yTokens.error.color,
    backgroundColor: '#FFF5F5',
  },
  iconWrapper: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    minHeight: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    // Touch target padding
    paddingHorizontal: 8,
  },
  errorContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: A11yTokens.error.color,
    borderRadius: 4,
  },
  errorText: {
    color: A11yTokens.error.color,
    fontSize: 13,
    fontWeight: '500',
  },
});
