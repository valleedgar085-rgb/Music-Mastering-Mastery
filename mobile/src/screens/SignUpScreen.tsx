import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors, spacing } from '../theme';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { ScreenNavigationProp } from '../navigation/navigation';

export default function SignUpScreen({ navigation }: { navigation: ScreenNavigationProp }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const res = await signUp(email.trim().toLowerCase(), password);
    if (!res.ok) {
      setError(res.error ?? 'Failed to sign up');
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>

      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="you@example.com"
        accessibilityLabel="email input"
      />

      <FormInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        accessibilityLabel="password input"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Sign up" onPress={handleSubmit} accessibilityLabel="Sign up" />

      <Pressable onPress={() => navigation.goBack()} style={styles.link} accessibilityLabel="Back to login">
        <Text style={styles.linkText}>Back to login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: Colors.babyBlueLight,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: spacing.lg,
  },
  link: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.navy,
  },
  error: {
    color: Colors.error,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
