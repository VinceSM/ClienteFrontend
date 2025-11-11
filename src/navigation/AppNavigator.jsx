// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\navigation\AppNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Debug
  console.log('🎯 AppNavigator - User:', user);
  console.log('🎯 AppNavigator - isLoading:', isLoading);
  console.log('🎯 AppNavigator - Renderizando:', user ? 'Main' : 'Auth');

  // No mostrar loading aquí, dejar que el hook maneje el estado
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}