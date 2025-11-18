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

    // Navegar al carrito
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

      {/* Footer modificado - Solo muestra Ver Carrito */}
      {carrito.length > 0 && (
        <View style={styles.footer}>
          <CartButton 
            itemCount={totalItems}
            onPress={handleVerCarrito}
            size="medium"
          />
          
          <View style={styles.footerInfo}>
            <Text style={styles.itemCount}>{totalItems} items</Text>
            <Text style={styles.totalLabel}>Total: {formatPrecio(calcularTotal())}</Text>
          </View>

          <TouchableOpacity 
            style={styles.verCarritoButton}
            onPress={handleVerCarrito}
          >
            <Text style={styles.verCarritoButtonText}>Ver Carrito</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      
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
    width: 40,
  },
  container: {
    flex: 1,
  },
  comercioInfo: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  comercioNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  comercioEslogan: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  productosCount: {
    fontSize: 12,
    color: '#999999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  categoriasSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 16,
    marginBottom: 12,
  },
  categoriasList: {
    paddingHorizontal: 16,
  },
  categoriaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
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
    flex: 1,
    marginBottom: 16,
  },
  productosList: {
    paddingHorizontal: 16,
  },
  productoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    lineHeight: 18,
  },
  productoPrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  productoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDisponible: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  stockText: {
    fontSize: 12,
    color: '#22C55E',
    marginLeft: 4,
  },
  ofertaBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  agregarButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Nuevos estilos para el footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  footerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemCount: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  verCarritoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verCarritoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
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