import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './LoginScreen'; // Reutilizamos los estilos

export default function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>DeliveryYa</Text>
          <Text style={styles.subtitle}>Crear Cuenta</Text>
          <Text style={styles.description}>Regístrate como cliente</Text>
        </View>
        
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Pantalla de registro - En desarrollo
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Volver al Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}