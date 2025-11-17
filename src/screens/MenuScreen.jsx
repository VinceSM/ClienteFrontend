import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importar useAuth y CartContext
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

// Componentes del carrito
import CartFooter from '../components/carrito/CartFooter';
import CartButton from '../components/carrito/CartButton';
import pedidoService from '../services/pedidoService';

export default function MenuScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { comercio, productos } = route.params || {};
  
  // Usar el contexto del carrito
  const { 
    items: carrito, 
    addToCart, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    setComercio 
  } = useCart();

  // Obtener clienteId del usuario autenticado
  const clienteId = user?.id || user?.idcliente;

  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [loading, setLoading] = useState(false);

  // DEBUG
  console.log('🔍 MenuScreen - User:', user);
  console.log('🔍 MenuScreen - ClienteId:', clienteId);
  console.log('🔍 MenuScreen - Comercio:', comercio?.nombreComercio);

  // Obtener categorías únicas de los productos
  const categorias = ['todos', ...new Set(productos?.map(p => p.categoria).filter(Boolean))];

  // Filtrar productos por búsqueda y categoría
  const productosFiltrados = productos?.filter(producto => {
    const coincideBusqueda = producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           producto.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
    const coincideCategoria = categoriaActiva === 'todos' || producto.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  }) || [];

  // Funciones del carrito usando el contexto
  const agregarAlCarrito = (producto) => {
    addToCart(producto, 1);
  };

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
    removeFromCart(productoId);
  };

  // Calcular total y cantidad de items
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.producto.precioUnitario * item.cantidad), 0);
  };

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  // Función para formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(precio);
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
      metodoPagoId: 1,
      items: carrito.map(item => ({
        productoId: item.producto.idproducto,
        comercioId: comercio.idcomercio,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precioUnitario
      }))
    };


      console.log('📦 Creando pedido con datos:', pedidoData);
      
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
            onPress: () => clearCart()
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

  const handleVerCarrito = () => {
    // Limpiar datos sensibles del comercio
    const safeComercio = {
      idcomercio: comercio.idcomercio,
      nombreComercio: comercio.nombreComercio,
      tipoComercio: comercio.tipoComercio,
      eslogan: comercio.eslogan,
      fotoPortada: comercio.fotoPortada,
      envio: comercio.envio,
      deliveryPropio: comercio.deliveryPropio,
      celular: comercio.celular,
      ciudad: comercio.ciudad,
      calle: comercio.calle,
      numero: comercio.numero,
    };

    // Configurar el comercio en el contexto
    setComercio(safeComercio);

    // Navegar sin pasar funciones
    navigation.navigate('Cart', {
      clienteId,
    });
  };

  const renderProducto = ({ item: producto }) => (
    <View style={styles.productoCard}>
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{producto.nombre}</Text>
        <Text style={styles.productoDescripcion} numberOfLines={2}>
          {producto.descripcion || 'Sin descripción'}
        </Text>
        <Text style={styles.productoPrecio}>
          {formatPrecio(producto.precioUnitario)}
        </Text>
        
        <View style={styles.productoMeta}>
          {producto.stock && (
            <View style={styles.stockDisponible}>
              <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
              <Text style={styles.stockText}>Disponible</Text>
            </View>
          )}
          
          {producto.oferta && (
            <View style={styles.ofertaBadge}>
              <Text style={styles.ofertaText}>Oferta</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.productoImagenContainer}>
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
        
        <TouchableOpacity 
          style={styles.agregarButton}
          onPress={() => agregarAlCarrito(producto)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoria = ({ item: categoria }) => (
    <TouchableOpacity
      style={[
        styles.categoriaButton,
        categoriaActiva === categoria && styles.categoriaButtonActive
      ]}
      onPress={() => setCategoriaActiva(categoria)}
    >
      <Text style={[
        styles.categoriaText,
        categoriaActiva === categoria && styles.categoriaTextActive
      ]}>
        {categoria === 'todos' ? 'Todos' : categoria}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menú de {comercio?.nombreComercio}</Text>
        <View style={styles.headerRight}>
          <CartButton 
            itemCount={totalItems}
            onPress={handleVerCarrito}
            size="small"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.comercioInfo}>
          <Text style={styles.comercioNombre}>{comercio?.nombreComercio}</Text>
          <Text style={styles.comercioEslogan}>{comercio?.eslogan}</Text>
          <Text style={styles.productosCount}>
            {productosFiltrados.length} de {productos?.length || 0} productos
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {categorias.length > 1 && (
          <View style={styles.categoriasSection}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <FlatList
              data={categorias}
              renderItem={renderCategoria}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriasList}
            />
          </View>
        )}

        <View style={styles.productosSection}>
          {productosFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="fast-food-outline" 
                size={64} 
                color="#CCCCCC" 
              />
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Este comercio no tiene productos en su menú'
                }
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                Productos {categoriaActiva !== 'todos' ? `- ${categoriaActiva}` : ''}
              </Text>
              <FlatList
                data={productosFiltrados}
                renderItem={renderProducto}
                keyExtractor={(item) => item.idproducto?.toString() || Math.random().toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.productosList}
              />
            </>
          )}
        </View>
      </ScrollView>

      <CartFooter
        itemCount={totalItems}
        total={calcularTotal()}
        onCartPress={handleVerCarrito}
        onCheckout={handleRealizarPedido}
        showCartButton={false}
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Creando tu pedido...</Text>
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
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  comercioInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  comercioNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  comercioEslogan: {
    fontSize: 16,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  productosCount: {
    fontSize: 14,
    color: '#999999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: 20,
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriasSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  categoriasList: {
    gap: 8,
  },
  categoriaButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 8,
  },
  categoriaButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  categoriaText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  categoriaTextActive: {
    color: '#FFFFFF',
  },
  productosSection: {
    paddingHorizontal: 20,
  },
  productosList: {
    gap: 16,
  },
  productoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productoInfo: {
    flex: 1,
    marginRight: 12,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  productoDescripcion: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  productoPrecio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  productoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockDisponible: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
  },
  ofertaBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ofertaText: {
    fontSize: 10,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  productoImagenContainer: {
    position: 'relative',
  },
  productoImagen: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  productoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agregarButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
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