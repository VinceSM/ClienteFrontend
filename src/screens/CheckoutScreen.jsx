import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CheckoutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Pedido</Text>
      <Text style={styles.subtitle}>Próximamente...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
});