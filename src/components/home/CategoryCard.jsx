import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity style={styles.categoriaCard} onPress={onPress}>
      <View style={styles.categoriaIconContainer}>
        <Text style={styles.categoriaIcon}>{category.icon}</Text>
      </View>
      <Text style={styles.categoriaNombre}>{category.nombre}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoriaCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  categoriaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaIcon: {
    fontSize: 24,
  },
  categoriaNombre: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
});