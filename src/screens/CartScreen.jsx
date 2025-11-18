import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Modal
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importar hooks y servicios
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import pedidoService from '../services/pedidoService';

// Componentes del carrito
import CartItem from '../components/carrito/CartItem';

export default function CartScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  
  // Usar el contexto del carrito
  const { 
    items: carrito, 
    comercio, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    getTotalPrice
  } = useCart();

  const { clienteId: clienteIdFromParams } = route.params || {};
  const clienteId = clienteIdFromParams || user?.id;

  const [loading, setLoading] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [direccion, setDireccion] = useState('Calle 25 entre 24 y 26 N1681');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [observaciones, setObservaciones] = useState('');

  // Función para formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  // Calcular total usando la función del contexto
  const calcularTotal = () => {
    return getTotalPrice();
  };

  const totalConEnvio = calcularTotal() + (comercio?.envio || 0);

  // Funciones para modificar el carrito usando el contexto
  const aumentarCantidad = (productoId) => {
    const item = carrito.find(item => item.producto.idproducto === productoId);
    if (item) {
      updateQuantity(productoId, item.cantidad + 1);
    }
  };

  const disminuirCantidad = (productoId) => {
    const item = carrito.find(item => item.producto.idproducto === productoId);
    if (item && item.cantidad > 1) {
      updateQuantity(productoId, item.cantidad - 1);
    } else {
      removeFromCart(productoId);
    }
  };

  const eliminarDelCarrito = (productoId) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro de que quieres eliminar este producto del carrito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeFromCart(productoId);
          }
        }
      ]
    );
  };

  const handleConfirmarPedido = () => {
    if (!direccion.trim()) {
      Alert.alert('Error', 'Por favor ingresa una dirección de entrega');
      return;
    }
    setShowConfirmacion(true);
  };

  const handleRealizarPedido = async () => {
    if (carrito.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos al carrito antes de realizar el pedido');
      return;
    }

    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al cliente. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (!comercio?.idcomercio) {
      Alert.alert('Error', 'Información del comercio incompleta');
      return;
    }

    setLoading(true);

    try {
      const pedidoData = {
        clienteId: clienteId,
        comercioRepartidor: comercio.idcomercio,
        metodoPagoId: metodoPago === 'efectivo' ? 1 : 2, // 1: Efectivo, 2: Tarjeta
        direccionEntrega: direccion,
        observaciones: observaciones,
        items: carrito.map(item => ({
          productoId: item.producto.idproducto,
          comercioId: comercio.idcomercio,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precioUnitario
        }))
      };

      console.log('📦 Creando pedido desde CartScreen:', pedidoData);
      
      const resultado = await pedidoService.createPedido(pedidoData);
      
      console.log('✅ Pedido creado exitosamente:', resultado);
      
      setShowConfirmacion(false);
      
      Alert.alert(
        '¡Pedido realizado! 🎉',
        `Tu pedido #${resultado.codigo} ha sido creado exitosamente.\nTotal: ${formatPrecio(totalConEnvio)}`,
        [
          {
            text: 'Ver mis pedidos',
            onPress: () => {
              clearCart();
              navigation.navigate('Orders');
            }
          },
          {
            text: 'Seguir comprando',
            style: 'cancel',
            onPress: () => {
              clearCart();
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      Alert.alert(
        'Error al realizar pedido', 
        error.message || 'No se pudo completar el pedido. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <CartItem 
      item={item}
      onIncrease={() => aumentarCantidad(item.producto.idproducto)}
      onDecrease={() => disminuirCantidad(item.producto.idproducto)}
      onRemove={() => eliminarDelCarrito(item.producto.idproducto)}
      formatPrecio={formatPrecio}
    />
  );

  // Modal de confirmación
  const ModalConfirmacion = () => (
    <Modal
      visible={showConfirmacion}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Confirmar Pedido</Text>
          <TouchableOpacity 
            onPress={() => setShowConfirmacion(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Dirección de entrega */}
          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>📍 Dirección de entrega</Text>
            <TextInput
              style={styles.direccionInput}
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Ingresa tu dirección de entrega"
              multiline
            />
          </View>

          {/* Método de pago */}
          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>💳 Método de pago</Text>
            <View style={styles.pagoOptions}>
              <TouchableOpacity
                style={[
                  styles.pagoOption,
                  metodoPago === 'efectivo' && styles.pagoOptionSelected
                ]}
                onPress={() => setMetodoPago('efectivo')}
              >
                <Ionicons 
                  name="cash" 
                  size={24} 
                  color={metodoPago === 'efectivo' ? '#FF6B6B' : '#666'} 
                />
                <Text style={[
                  styles.pagoOptionText,
                  metodoPago === 'efectivo' && styles.pagoOptionTextSelected
                ]}>
                  Efectivo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pagoOption,
                  metodoPago === 'tarjeta' && styles.pagoOptionSelected
                ]}
                onPress={() => setMetodoPago('tarjeta')}
              >
                <Ionicons 
                  name="card" 
                  size={24} 
                  color={metodoPago === 'tarjeta' ? '#FF6B6B' : '#666'} 
                />
                <Text style={[
                  styles.pagoOptionText,
                  metodoPago === 'tarjeta' && styles.pagoOptionTextSelected
                ]}>
                  Tarjeta
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Observaciones */}
          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>📝 Observaciones (opcional)</Text>
            <TextInput
              style={styles.observacionesInput}
              value={observaciones}
              onChangeText={setObservaciones}
              placeholder="Alguna indicación especial para la entrega..."
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Resumen del pedido */}
          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>📦 Resumen del pedido</Text>
            <View style={styles.resumenContainer}>
              {carrito.map((item, index) => (
                <View key={index} style={styles.resumenItem}>
                  <Text style={styles.resumenNombre}>
                    {item.cantidad}x {item.producto.nombre}
                  </Text>
                  <Text style={styles.resumenPrecio}>
                    {formatPrecio(item.producto.precioUnitario * item.cantidad)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.resumenTotal}>
                <Text style={styles.resumenTotalLabel}>Total:</Text>
                <Text style={styles.resumenTotalPrecio}>
                  {formatPrecio(totalConEnvio)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={[
              styles.confirmarButton,
              loading && styles.confirmarButtonDisabled
            ]}
            onPress={handleRealizarPedido}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.confirmarButtonText}>
                  Confirmar Pedido
                </Text>
                <Text style={styles.confirmarButtonSubtext}>
                  {formatPrecio(totalConEnvio)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  // Si no hay carrito o comercio, mostrar estado vacío
  if (!carrito || !comercio) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrito</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Carrito no disponible</Text>
          <Text style={styles.emptyText}>
            No se pudo cargar la información del carrito
          </Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueButtonText}>Volver al Menú</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (carrito.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrito</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>
            Agrega algunos productos del menú para continuar
          </Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueButtonText}>Ver Menú</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrito</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Información del comercio */}
      <View style={styles.comercioInfo}>
        <Text style={styles.comercioNombre}>{comercio.nombreComercio}</Text>
        <Text style={styles.comercioEslogan}>{comercio.eslogan}</Text>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={carrito}
        renderItem={renderItem}
        keyExtractor={(item) => item.producto.idproducto.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      {/* Resumen del pedido */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>
            {formatPrecio(calcularTotal())}
          </Text>
        </View>
        
        {comercio.envio > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío:</Text>
            <Text style={styles.summaryValue}>
              {formatPrecio(comercio.envio)}
            </Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            {formatPrecio(totalConEnvio)}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleConfirmarPedido}
        >
          <Text style={styles.checkoutButtonText}>
            Confirmar Pedido - {formatPrecio(totalConEnvio)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmación */}
      <ModalConfirmacion />

      {/* Overlay de loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Procesando pedido...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 32,
  },
  comercioInfo: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  comercioNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  comercioEslogan: {
    fontSize: 14,
    color: '#666666',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  summaryContainer: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  // Estilos del modal de confirmación
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  confirmSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  direccionInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pagoOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  pagoOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    gap: 8,
  },
  pagoOptionSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  pagoOptionText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  pagoOptionTextSelected: {
    color: '#FF6B6B',
  },
  observacionesInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  resumenContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  resumenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumenNombre: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  resumenPrecio: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  resumenTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  resumenTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  resumenTotalPrecio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  confirmarButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmarButtonDisabled: {
    backgroundColor: '#FFB8B8',
  },
  confirmarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  confirmarButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
});