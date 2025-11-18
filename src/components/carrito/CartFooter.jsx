import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CartButton from './CartButton';

export default function CartFooter({ 
  itemCount = 0, 
  total = 0, 
  onCartPress, 
  onCheckout,
  showCartButton = true 
}) {
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <View style={styles.footer}>
      {showCartButton && (
        <CartButton 
          itemCount={itemCount}
          onPress={onCartPress}
          size="medium"
        />
      )}
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>
          {formatPrecio(total)}
        </Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.checkoutButton,
          itemCount === 0 && styles.checkoutButtonDisabled
        ]}
        onPress={onCheckout}
        disabled={itemCount === 0}
      >
        <Text style={styles.checkoutButtonText}>
          Ver Carrito
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  totalContainer: {
    flex: 1,
    marginLeft: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});