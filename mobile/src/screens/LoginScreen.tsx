import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors, spacing } from '../theme';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { ScreenNavigationProp } from '../navigation/navigation';

export default function LoginScreen({ navigation }: { navigation: ScreenNavigationProp }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const res = await signIn(email.trim().toLowerCase(), password);
    if (!res.ok) {
      setError(res.error ?? 'Failed to sign in');
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>

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

      <Button label="Log in" onPress={handleSubmit} accessibilityLabel="Log in" />

      <Pressable onPress={() => navigation.navigate('SignUp')} style={styles.link} accessibilityLabel="Go to sign up">
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
