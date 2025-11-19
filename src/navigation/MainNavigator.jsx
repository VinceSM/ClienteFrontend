// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\navigation\MainNavigator.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

// Importar todas las pantallas
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

// Importar los nuevos componentes
import MisPedidos from '../components/Perfil/MisPedidos';
import MetodosPago from '../components/Perfil/MetodosPago';
import Notificaciones from '../components/Perfil/Notificaciones';
import Ayuda from '../components/Perfil/Ayuda';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator para el perfil y sus secciones
function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ 
          title: 'Mi Perfil',
          headerShown: true,
          headerTintColor: '#FF4D4D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="MisPedidos" 
        component={MisPedidos}
        options={{ 
          title: 'Mis Pedidos',
          headerTintColor: '#FF4D4D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="MetodosPago" 
        component={MetodosPago}
        options={{ 
          title: 'Métodos de Pago',
          headerTintColor: '#FF4D4D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="Notificaciones" 
        component={Notificaciones}
        options={{ 
          title: 'Notificaciones',
          headerTintColor: '#FF4D4D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="Ayuda" 
        component={Ayuda}
        options={{ 
          title: 'Centro de Ayuda',
          headerTintColor: '#FF4D4D',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Tab Navigator actualizado para usar el ProfileStack
function HomeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF4D4D',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📦</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#FF4D4D',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // Agregar estas opciones para mejorar los gestos
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="HomeTabs" 
        component={HomeTabNavigator}
        options={{ 
          headerShown: false,
          gestureEnabled: false, // Deshabilitar gestos en la pantalla principal
        }}
      />
      <Stack.Screen 
        name="Restaurant" 
        component={RestaurantScreen}
        options={{ 
          title: 'Comercio',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{ 
          title: 'Menú',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ 
          title: 'Carrito',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ 
          title: 'Finalizar Pedido',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}