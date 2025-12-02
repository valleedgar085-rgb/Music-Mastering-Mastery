import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, spacing } from '../theme';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.content}>App settings will go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.babyBlueLight,
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.navy,
  },
  content: {
    marginTop: spacing.sm,
    color: Colors.navy,
  },
});
