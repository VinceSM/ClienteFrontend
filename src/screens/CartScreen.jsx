import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// Importar hooks y servicios
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import pedidoService from '../services/pedidoService';
import metodoPagoService from '../services/metodoPagoService';

// Componentes del carrito
import CartItem from '../components/carrito/CartItem';
import ConfirmarPedidoModal from '../components/carrito/ConfirmarPedidoModal';

export default function CartScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const { 
    items: carrito, 
    comercio, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    getTotalPrice
  } = useCart();

  const clienteId = user?.id;

  const [loading, setLoading] = useState(false);
  const [loadingMetodos, setLoadingMetodos] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [direccion, setDireccion] = useState('');

  // Cargar métodos de pago
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingMetodos(true);
        const metodosData = await metodoPagoService.getAllMetodosPago();
        setMetodosPago(metodosData);
        if (metodosData.length > 0) {
          setMetodoPagoSeleccionado(metodosData[0]);
        }
      } catch (error) {
        console.error('Error cargando métodos de pago:', error);
        setMetodosPago([
          { idmetodo: 1, metodo: 'EFECTIVO', descripcion: 'Pago en efectivo' },
          { idmetodo: 2, metodo: 'TARJETA', descripcion: 'Pago con tarjeta' }
        ]);
        setMetodoPagoSeleccionado({ idmetodo: 1, metodo: 'EFECTIVO' });
      } finally {
        setLoadingMetodos(false);
      }
    };
    cargarDatos();
  }, []);

  const handleMetodoPagoChange = useCallback((metodo) => {
    setMetodoPagoSeleccionado(metodo);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowConfirmacion(false);
  }, []);

  const handleAbrirConfirmacion = useCallback(() => {
    setShowConfirmacion(true);
  }, []);

  // Función para formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const calcularTotal = () => getTotalPrice();
  const totalConEnvio = calcularTotal() + (comercio?.envio || 0);

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => {
      return total + (item.producto.precioUnitario * item.cantidad);
    }, 0);
  };

  const subtotal = calcularSubtotal();
  const costoEnvio = comercio?.envio || 0;

  const handleConfirmarPedido = async (direccion, observaciones) => {
    if (!direccion.trim()) {
      Alert.alert('Dirección requerida', 'Por favor ingresa una dirección de entrega.');
      return;
    }

    setLoading(true);

    try {
      const pedidoData = {
        clienteId: clienteId,
        comercioRepartidor: false,
        metodoPagoId: metodoPagoSeleccionado.idmetodo,
        direccionEnvio: direccion.trim(),
        observaciones: observaciones || '',
        subtotalPedido: subtotal,
        costoEnvio: costoEnvio,
        totalPedido: totalConEnvio,
        items: carrito.map(item => ({
          productoId: item.producto.idproducto,
          comercioId: comercio.idcomercio,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precioUnitario,
          total: item.producto.precioUnitario * item.cantidad
        }))
      };

      console.log('📦 Enviando pedido al backend:', pedidoData);
      
      const resultado = await pedidoService.createPedido(pedidoData);
      
      console.log('✅ Respuesta del backend:', resultado);
      
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
      Alert.alert('Error', error.message || 'No se pudo completar el pedido.');
    } finally {
      setLoading(false);
    }
  };

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

  const renderItem = ({ item }) => (
    <CartItem 
      item={item}
      onIncrease={() => aumentarCantidad(item.producto.idproducto)}
      onDecrease={() => disminuirCantidad(item.producto.idproducto)}
      onRemove={() => eliminarDelCarrito(item.producto.idproducto)}
      formatPrecio={formatPrecio}
    />
  );

  // Si no hay carrito o comercio, mostrar estado vacío
  if (!carrito || !comercio) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
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
          onPress={handleAbrirConfirmacion}
        >
          <Text style={styles.checkoutButtonText}>
            Realizar Pedido - {formatPrecio(totalConEnvio)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmación usando el componente separado */}
      <ConfirmarPedidoModal
        visible={showConfirmacion}
        onClose={handleCloseModal}
        onConfirm={handleConfirmarPedido}
        loading={loading}
        carrito={carrito}
        comercio={comercio}
        metodosPago={metodosPago}
        metodoPagoSeleccionado={metodoPagoSeleccionado}
        onMetodoPagoChange={handleMetodoPagoChange}
        loadingMetodos={loadingMetodos}
        formatPrecio={formatPrecio}
        totalConEnvio={totalConEnvio}
      />

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

// Estilos (mantener los mismos que tenías)
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
});