import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../theme';

export default function DrawerContent(props: any) {
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.email}>{user?.email ?? 'Guest'}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {/* Drawer items will be rendered by navigator; add a manual sign out button */}
        <DrawerItem label="Home" onPress={() => props.navigation.navigate('Home')} />
        <DrawerItem label="Profile" onPress={() => props.navigation.navigate('Profile')} />
        <DrawerItem label="Settings" onPress={() => props.navigation.navigate('Settings')} />
      </View>

      <View style={styles.footer}>
        <Pressable onPress={async () => { await signOut(); }} style={styles.signOutButton} accessibilityLabel="Sign out">
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: Colors.babyBlue,
  },
  email: {
    color: Colors.navy,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  signOutButton: {
    backgroundColor: Colors.babyBlueAccent,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
