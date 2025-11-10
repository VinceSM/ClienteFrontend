import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [resultados, setResultados] = useState([]);

  // Datos de ejemplo
  const comercios = [
    {
      id: 1,
      nombre: 'Pizza Paradise',
      categoria: 'Pizza',
      rating: 4.5,
      tiempoEntrega: '30-40 min',
      imagen: 'https://via.placeholder.com/300x150',
    },
    // Más comercios...
  ];

  const productos = [
    {
      id: 101,
      nombre: 'Pizza Margarita',
      precio: 1200,
      comercio: 'Pizza Paradise',
      imagen: 'https://via.placeholder.com/100x100',
    },
    // Más productos...
  ];

  const buscar = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const comerciosFiltrados = comercios.filter(c =>
        c.nombre.toLowerCase().includes(query.toLowerCase())
      );
      const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(query.toLowerCase())
      );
      setResultados([...comerciosFiltrados, ...productosFiltrados]);
    } else {
      setResultados([]);
    }
  };

  const renderResultado = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultadoCard}
      onPress={() => {
        if (item.precio) {
          // Es un producto
          navigation.navigate('Restaurant', { comercioId: item.comercioId });
        } else {
          // Es un comercio
          navigation.navigate('Restaurant', { comercio: item });
        }
      }}
    >
      <Image source={{ uri: item.imagen }} style={styles.resultadoImagen} />
      <View style={styles.resultadoInfo}>
        <Text style={styles.resultadoNombre}>{item.nombre}</Text>
        {item.precio ? (
          <Text style={styles.resultadoTipo}>Producto • ${item.precio}</Text>
        ) : (
          <Text style={styles.resultadoTipo}>Comercio • {item.categoria}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar comercios, platos..."
          value={searchQuery}
          onChangeText={buscar}
          autoFocus
        />
      </View>

      {resultados.length === 0 && searchQuery.length > 2 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No encontramos resultados para "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={resultados}
          renderItem={renderResultado}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  resultadoCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  resultadoImagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resultadoInfo: {
    flex: 1,
  },
  resultadoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  resultadoTipo: {
    fontSize: 14,
    color: '#666666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});