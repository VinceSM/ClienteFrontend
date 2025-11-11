import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CartBadge from './CartBadge';

export default function CartButton({ 
  itemCount = 0, 
  onPress, 
  size = 'medium',
  showBadge = true 
}) {
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, iconSize: 20 };
      case 'large':
        return { width: 60, height: 60, iconSize: 28 };
      default:
        return { width: 50, height: 50, iconSize: 24 };
    }
  };

  const { width, height, iconSize } = getButtonSize();

  return (
    <TouchableOpacity 
      style={[styles.button, { width, height }]}
      onPress={onPress}
    >
      <Ionicons name="cart" size={iconSize} color="#FFFFFF" />
      {showBadge && <CartBadge count={itemCount} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});