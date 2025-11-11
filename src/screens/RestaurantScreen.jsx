import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import comercioService from '../services/comercioService';
import horarioService from '../services/horarioService';

export default function RestaurantScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { comercio } = route.params;

  const [comercioDetalle, setComercioDetalle] = useState(null);
  const [productos, setProductos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadComercioDetalle();
  }, [comercio]);

  const loadComercioDetalle = async () => {
    try {
      setLoading(true);
      
      // Cargar detalles del comercio
      const detalle = await comercioService.getComercioById(comercio.idcomercio);
      setComercioDetalle(detalle);

      // Cargar productos del comercio
      const productosData = await comercioService.getProductosByComercio(comercio.idcomercio);
      setProductos(productosData || []);

      // Cargar horarios del comercio
      const horariosData = await horarioService.getHorariosPorComercio(comercio.idcomercio);
      setHorarios(horariosData || []);

    } catch (error) {
      console.error('❌ Error cargando detalle del comercio:', error);
      setError('No se pudo cargar la información del comercio');
    } finally {
      setLoading(false);
    }
  };

  const handleVerMenu = () => {
    navigation.navigate('Menu', { 
      comercio: comercioDetalle || comercio,
      productos 
    });
  };

  // Función para formatear TimeSpan a hora legible
  const formatHora = (timeSpan) => {
    if (!timeSpan) return '--:--';
    
    // Asumiendo que timeSpan viene como "HH:MM:SS" o similar
    const parts = timeSpan.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeSpan;
  };

  // Función para obtener el nombre del día - CORREGIDA
  const getDiaNombre = (dias) => {
    // Si viene como string con el nombre del día
    if (typeof dias === 'string') {
      return dias;
    }
    
    // Si viene como número
    const diasMap = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      7: 'Domingo'
    };
    return diasMap[dias] || `Día ${dias}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Cargando comercio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadComercioDetalle}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const comercioInfo = comercioDetalle || comercio;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalle del Comercio</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen del comercio */}
        <View style={styles.imageContainer}>
          {comercioInfo.fotoPortada ? (
            <Image 
              source={{ uri: comercioInfo.fotoPortada }}
              style={styles.comercioImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="restaurant" size={64} color="#999" />
              <Text style={styles.placeholderText}>{comercioInfo.nombreComercio}</Text>
            </View>
          )}
          
          {comercioInfo.destacado && (
            <View style={styles.destacadoBadge}>
              <Ionicons name="star" size={16} color="#FFFFFF" />
              <Text style={styles.destacadoText}>Destacado</Text>
            </View>
          )}
        </View>

        {/* Información principal */}
        <View style={styles.infoSection}>
          <Text style={styles.nombreComercio}>{comercioInfo.nombreComercio}</Text>
          <Text style={styles.tipoComercio}>{comercioInfo.eslogan}</Text>
          
          {/* Información de envío - SOLO MOSTRAMOS ESTO */}
          <View style={styles.envioInfo}>
            {comercioInfo.envio > 0 ? (
              <View style={styles.envioRow}>
                <Ionicons name="car" size={20} color="#666" />
                <Text style={styles.envioText}>Envío: ${comercioInfo.envio}</Text>
              </View>
            ) : (
              <View style={styles.envioRow}>
                <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                <Text style={styles.envioGratis}>Envío gratis</Text>
              </View>
            )}
          </View>
        </View>

        {/* Dirección */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Dirección</Text>
          </View>
          <Text style={styles.direccionText}>
            {comercioInfo.calle} {comercioInfo.numero}
            {comercioInfo.ciudad && `, ${comercioInfo.ciudad}`}
          </Text>
        </View>

        {/* Horarios - DATOS REALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Horarios de Atención</Text>
          </View>
          
          {horarios.length > 0 ? (
            horarios.map((horario, index) => (
              <View key={horario.idhorarios || index} style={styles.horarioItem}>
                <Text style={styles.horarioDia}>
                  {getDiaNombre(horario.dias)}
                </Text>
                {horario.abierto ? (
                  <Text style={styles.horarioHora}>
                    {formatHora(horario.apertura)} - {formatHora(horario.cierre)}
                  </Text>
                ) : (
                  <Text style={styles.horarioCerrado}>Cerrado</Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.horarioItem}>
              <Text style={styles.horarioDia}>Horarios no disponibles</Text>
              <Text style={styles.horarioCerrado}>Consultar</Text>
            </View>
          )}
        </View>

        {/* Información del comercio */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="restaurant" size={24} color="#FF6B6B" />
            <Text style={styles.statLabel}>Tipo</Text>
            <Text style={styles.statValue}>{comercioInfo.tipoComercio}</Text>
          </View>
          
          {comercioInfo.destacado && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="star" size={24} color="#FF6B6B" />
                <Text style={styles.statLabel}>Destacado</Text>
                <Text style={styles.statValue}>Sí</Text>
              </View>
            </>
          )}
        </View>

        {/* Botones de acción - SOLO VER MENÚ */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleVerMenu}
          >
            <Ionicons name="restaurant" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Ver Menú Completo</Text>
          </TouchableOpacity>
        </View>

        {/* Productos destacados */}
        {productos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="fast-food" size={20} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>Productos Disponibles</Text>
            </View>
            
            {productos.slice(0, 3).map((producto, index) => (
              <TouchableOpacity 
                key={producto.idproducto || index} 
                style={styles.productoItem}
                onPress={handleVerMenu}
              >
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre}>{producto.nombre}</Text>
                  <Text style={styles.productoDescripcion} numberOfLines={2}>
                    {producto.descripcion || 'Sin descripción'}
                  </Text>
                  {/* CORREGIDO: usar precioUnitario en lugar de precio */}
                  <Text style={styles.productoPrecio}>${producto.precioUnitario}</Text>
                </View>
                {producto.fotoPortada && producto.fotoPortada !== 'default.jpg' ? (
                  <Image 
                    source={{ uri: producto.fotoPortada }}
                    style={styles.productoImagen}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.productoPlaceholder}>
                    <Ionicons name="fast-food-outline" size={32} color="#999" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
            
            {productos.length > 3 && (
              <TouchableOpacity style={styles.verMasButton} onPress={handleVerMenu}>
                <Text style={styles.verMasText}>
                  Ver todos los productos ({productos.length})
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#FF6B6B" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  comercioImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },
  destacadoBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  destacadoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  nombreComercio: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  tipoComercio: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  envioInfo: {
    flexDirection: 'row',
  },
  envioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  envioText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  envioGratis: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 8,
  },
  direccionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  horarioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  horarioDia: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  horarioHora: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  horarioCerrado: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF5F5',
    margin: 20,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
  actionsContainer: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  productoInfo: {
    flex: 1,
    marginRight: 12,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  productoDescripcion: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  productoPrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  productoImagen: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verMasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    marginTop: 8,
  },
  verMasText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginRight: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});