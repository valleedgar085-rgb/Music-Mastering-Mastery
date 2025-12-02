import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function AppWrapper() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {user ? <DrawerNavigator /> : <AuthStack />}
      <StatusBar style="auto" />
    </>
  );
}
