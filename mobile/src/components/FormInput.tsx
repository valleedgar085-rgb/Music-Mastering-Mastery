import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Colors, spacing } from '../theme';

// Define the props for the FormInput component
interface FormInputProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export default function FormInput({ label, error, ...textInputProps }: FormInputProps) {
  const [isTouched, setIsTouched] = useState(false);
  const showError = isTouched && error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, showError ? styles.inputError : null]}
        // When the input loses focus, mark it as touched
        onBlur={() => setIsTouched(true)}
        {...textInputProps}
      />
      {showError ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: 6,
    color: Colors.navy,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.white,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    marginTop: 6,
  },
});
