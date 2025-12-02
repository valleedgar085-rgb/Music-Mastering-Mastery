import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, spacing } from '../theme';
import { ScreenNavigationProp } from '../navigation/navigation';
import Button from '../components/Button';

export default function HomeScreen({ navigation }: { navigation: ScreenNavigationProp }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Welcome to the app — baby blue theme is applied.</Text>

      <Button label="Open Menu" onPress={() => navigation.openDrawer()} accessibilityLabel="Open menu" />
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
    marginBottom: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.sm,
    color: Colors.navy,
    marginBottom: spacing.md,
  },
});
