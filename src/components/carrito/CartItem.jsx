import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartItem({ 
  item, 
  onIncrease, 
  onDecrease, 
  onRemove,
  formatPrecio 
}) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNombre}>{item.producto.nombre}</Text>
        <Text style={styles.itemDescripcion} numberOfLines={1}>
          {item.producto.descripcion || 'Sin descripción'}
        </Text>
        <Text style={styles.itemPrecio}>
          {formatPrecio(item.producto.precioUnitario)} c/u
        </Text>
      </View>

      <View style={styles.itemControls}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={onDecrease}
          >
            <Ionicons name="remove" size={16} color="#FF6B6B" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.cantidad}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={onIncrease}
          >
            <Ionicons name="add" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>
          {formatPrecio(item.producto.precioUnitario * item.cantidad)}
        </Text>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onRemove}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemDescripcion: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  itemPrecio: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  itemControls: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 8,
  },
  deleteButton: {
    padding: 4,
  },
});