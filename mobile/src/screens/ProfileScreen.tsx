import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors, spacing } from '../theme';

export default function ProfileScreen() {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.content}>Email: {user?.email}</Text>
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
