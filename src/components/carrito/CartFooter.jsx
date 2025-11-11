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
          Realizar Pedido
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  totalContainer: {
    flex: 1,
    marginLeft: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 150,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});