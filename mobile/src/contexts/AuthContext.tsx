import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@app_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
        }
      } catch (e) {
        console.warn('Failed to load user', e);
        await AsyncStorage.removeItem('@app_user');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    // basic validation
    if (!email || !email.includes('@')) return { ok: false, error: 'Enter a valid email' };
    if (!password || password.length < 8) return { ok: false, error: 'Password must be at least 8 characters' };

    const u = { email };
    try {
      await AsyncStorage.setItem('@app_user', JSON.stringify(u));
      setUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Storage error' };
    }
  };

  const signUp = async (email: string, password: string) => {
    // For this demo, signUp behaves like signIn
    return signIn(email, password);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@app_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

