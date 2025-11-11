import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommerceCard({ commerce, onPress }) {
  const nombre = commerce.nombreComercio || 'Comercio';
  const categoria = commerce.tipoComercio || 'Restaurante';
  const envio = commerce.envio || 0;
  const imagenUrl = commerce.fotoPortada;
  const destacado = commerce.destacado || false;

  return (
    <View style={styles.comercioCardWrapper}>
      <TouchableOpacity style={styles.comercioCard} onPress={onPress}>
        <View style={styles.comercioImageContainer}>
          {imagenUrl ? (
            <Image 
              source={{ uri: imagenUrl }}
              style={styles.comercioImagen}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="restaurant-outline" size={32} color="#999" />
              <Text style={styles.placeholderText} numberOfLines={2}>
                {nombre}
              </Text>
            </View>
          )}
          
          {destacado && (
            <View style={styles.destacadoBadge}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.destacadoText}>Destacado</Text>
            </View>
          )}
        </View>
        
        <View style={styles.comercioInfo}>
          <Text style={styles.comercioNombre} numberOfLines={1}>
            {nombre}
          </Text>
          <Text style={styles.comercioCategoria} numberOfLines={1}>
            {categoria}
          </Text>
          
          <View style={styles.comercioFooter}>
            {envio > 0 ? (
              <Text style={styles.precioEnvio}>
                Envío ${envio}
              </Text>
            ) : (
              <View style={styles.envioGratisContainer}>
                <Ionicons name="checkmark-circle" size={12} color="#22C55E" />
                <Text style={styles.envioGratis}>Gratis</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  comercioCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  comercioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  comercioImageContainer: {
    position: 'relative',
    height: 120,
  },
  comercioImagen: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  destacadoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  destacadoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  comercioInfo: {
    padding: 12,
  },
  comercioNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  comercioCategoria: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  comercioFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precioEnvio: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  envioGratisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  envioGratis: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});