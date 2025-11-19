// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\navigation\MainNavigator.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#FF4D4D',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        gestureEnabled: true,
        animation: 'slide_from_right',
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ 
          title: 'Mi Perfil',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="MisPedidos" 
        component={MisPedidos}
        options={{ 
          title: 'Mis Pedidos',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="MetodosPago" 
        component={MetodosPago}
        options={{ 
          title: 'Métodos de Pago',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="Notificaciones" 
        component={Notificaciones}
        options={{ 
          title: 'Notificaciones',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="Ayuda" 
        component={Ayuda}
        options={{ 
          title: 'Centro de Ayuda',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

// Componente personalizado para los íconos del tab
const TabIcon = ({ focused, emoji, label }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[
      styles.tabIcon,
      focused && styles.tabIconFocused
    ]}>
      {emoji}
    </Text>
    <Text style={[
      styles.tabLabel,
      focused && styles.tabLabelFocused
    ]}>
      {label}
    </Text>
  </View>
);

// Tab Navigator con estilo Instagram
function HomeTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF4D4D',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          paddingBottom: insets.bottom === 0 ? 6 : insets.bottom,
          height: 60 + (insets.bottom === 0 ? 0 : insets.bottom),
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🏠" />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          title: 'Buscar',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🔍" />
          ),
        }}
      />

      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="📦" />
          ),
        }}
      />

      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="👤" />
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
          fontSize: 18,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: '#E5E5EA',
        },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
        animationDuration: 300,
        cardStyle: { backgroundColor: '#FFFFFF' },
        headerBackTitleVisible: false,
        headerLeftContainerStyle: { paddingLeft: 8 },
        headerRightContainerStyle: { paddingRight: 16 },
      }}
    >
      <Stack.Screen 
        name="HomeTabs" 
        component={HomeTabNavigator}
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="Restaurant" 
        component={RestaurantScreen}
        options={{ 
          title: 'Comercio',
          headerTransparent: false,
        }}
      />
      <Stack.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{ 
          title: 'Menú',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ 
          title: 'Carrito',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ 
          title: 'Finalizar Pedido',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabIcon: {
    fontSize: 24,
    color: '#8E8E93',
    marginBottom: 2,
  },
  tabIconFocused: {
    color: '#FF4D4D',
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: '#FF4D4D',
    fontWeight: '600',
  },
});