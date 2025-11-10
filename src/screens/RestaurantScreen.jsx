import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantScreen({ route }) {
  const navigation = useNavigation();
  const { comercio } = route.params || {};

  // Datos de ejemplo si no vienen por parámetros
  const comercioData = comercio || {
    id: 1,
    nombre: 'Pizza Paradise',
    categoria: 'Pizza',
    rating: 4.5,
    tiempoEntrega: '30-40 min',
    precioEnvio: 200,
    imagen: 'https://via.placeholder.com/400x200',
    descripcion: 'Las mejores pizzas artesanales de la ciudad',
    horario: '10:00 - 23:00',
  };

  const handleVerMenu = () => {
    navigation.navigate('Menu', { comercio: comercioData });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen del comercio */}
        <Image source={{ uri: comercioData.imagen }} style={styles.comercioImagen} />

        {/* Información del comercio */}
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{comercioData.nombre}</Text>
          <Text style={styles.categoria}>{comercioData.categoria}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {comercioData.rating}</Text>
            <Text style={styles.tiempoEntrega}>• {comercioData.tiempoEntrega}</Text>
            <Text style={styles.precioEnvio}>• ${comercioData.precioEnvio} envío</Text>
          </View>

          <Text style={styles.descripcion}>{comercioData.descripcion}</Text>

          <View style={styles.horarioContainer}>
            <Text style={styles.horarioLabel}>Horario:</Text>
            <Text style={styles.horario}>{comercioData.horario}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botón flotante */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleVerMenu}>
          <Text style={styles.menuButtonText}>Ver Menú</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  comercioImagen: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  categoria: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4D4D',
    marginRight: 8,
  },
  tiempoEntrega: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  precioEnvio: {
    fontSize: 14,
    color: '#666666',
  },
  descripcion: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  horarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horarioLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  horario: {
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});