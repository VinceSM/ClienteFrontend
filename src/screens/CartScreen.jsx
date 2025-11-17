import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importar hooks y servicios
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import pedidoService from '../services/pedidoService';

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

  const [loading, setLoading] = React.useState(false);

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
        metodoPagoId: 1, // Método de pago por defecto
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
      
      Alert.alert(
        '¡Pedido realizado! 🎉',
        `Tu pedido #${resultado.codigo} ha sido creado exitosamente.\nTotal: ${formatPrecio(calcularTotal())}`,
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
            onPress={() => disminuirCantidad(item.producto.idproducto)}
          >
            <Ionicons name="remove" size={16} color="#FF6B6B" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.cantidad}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => aumentarCantidad(item.producto.idproducto)}
          >
            <Ionicons name="add" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemTotal}>
          {formatPrecio(item.producto.precioUnitario * item.cantidad)}
        </Text>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => eliminarDelCarrito(item.producto.idproducto)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
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
            {formatPrecio(calcularTotal() + (comercio.envio || 0))}
          </Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.checkoutButton,
            loading && styles.checkoutButtonDisabled
          ]}
          onPress={handleRealizarPedido}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.checkoutButtonText}>
              Confirmar Pedido - {formatPrecio(calcularTotal() + (comercio.envio || 0))}
            </Text>
          )}
        </TouchableOpacity>
      </View>

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

// Los styles permanecen igual...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  comercioInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    fontStyle: 'italic',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemInfo: {
    marginBottom: 12,
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
    marginBottom: 6,
  },
  itemPrecio: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quantityText: {
    fontSize: 16,
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
  },
  deleteButton: {
    padding: 8,
  },
  summaryContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
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
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 18,
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
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});