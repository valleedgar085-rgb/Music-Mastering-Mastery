import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import { Colors, spacing } from '../theme';

interface ButtonProps extends PressableProps {
  label: string;
}

export default function Button({ label, ...pressableProps }: ButtonProps) {
  return (
    <Pressable style={styles.button} {...pressableProps}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.babyBlue,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700',
  },
});
