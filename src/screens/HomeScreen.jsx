import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import comercioService from '../services/comercioService';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [comercios, setComercios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando datos reales...');
      
      const comerciosData = await comercioService.getAllComercios();
      console.log('✅ Comercios cargados:', comerciosData);
      
      setComercios(comerciosData || []);

      const tiposUnicos = [...new Set(comerciosData.map(c => c.tipoComercio))].filter(Boolean);
      const categoriasReales = tiposUnicos.map((tipo, index) => ({
        id: index + 1,
        nombre: tipo,
        icon: getIconForCategory(tipo)
      }));

      if (categoriasReales.length === 0) {
        setCategorias([
          { id: 1, nombre: 'Restaurante', icon: '🍽️' },
          { id: 2, nombre: 'Comida Rápida', icon: '🍔' },
          { id: 3, nombre: 'Pizzería', icon: '🍕' },
          { id: 4, nombre: 'Postres', icon: '🍰' },
        ]);
      } else {
        setCategorias(categoriasReales);
      }

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('No se pudieron cargar los comercios');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const getIconForCategory = (tipo) => {
    const iconMap = {
      'Restaurante': '🍽️',
      'Comida Rápida': '🍔',
      'Pizzería': '🍕',
      'Sushi': '🍣',
      'Asiática': '🍜',
      'Cafetería': '☕',
      'Postres': '🍰',
      'Heladería': '🍦',
      'Vegetariano': '🥗',
      'Mexicana': '🌮',
    };
    return iconMap[tipo] || '🏪';
  };

  // Filtrar comercios basado en búsqueda
  const filteredComercios = comercios.filter(comercio => 
    comercio.nombreComercio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comercio.tipoComercio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoria = ({ item }) => (
    <TouchableOpacity style={styles.categoriaCard}>
      <View style={styles.categoriaIconContainer}>
        <Text style={styles.categoriaIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoriaNombre}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const renderComercioItem = ({ item }) => {
    const comercio = item;
    
    const nombre = comercio.nombreComercio || 'Comercio';
    const categoria = comercio.tipoComercio || 'Restaurante';
    const envio = comercio.envio || 0;
    const imagenUrl = comercio.fotoPortada;
    const destacado = comercio.destacado || false;
    
    return (
      <View style={styles.comercioCardWrapper}>
        <TouchableOpacity 
          style={styles.comercioCard}
          onPress={() => navigation.navigate('Restaurant', { comercio: item })}
        >
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
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Cargando comercios...</Text>
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
          <Text style={styles.errorSubtext}>Verifica que el backend esté ejecutándose</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userGreeting}>
            <Text style={styles.greeting}>
              ¡Hola, {user?.nombreCompleto?.split(' ')[0] || 'Usuario'}!
            </Text>
            <Text style={styles.subtitle}>¿Qué querés comer hoy?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>
              {user?.nombreCompleto?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar restaurantes o comidas..."
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
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadData}
            colors={['#FF6B6B']}
            tintColor="#FF6B6B"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categorías */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categorias}
            renderItem={renderCategoria}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriasList}
          />
        </View>

        {/* Comercios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredComercios.length === 1 
                ? '1 comercio disponible' 
                : `${filteredComercios.length} comercios disponibles`
              }
            </Text>
          </View>
          
          {filteredComercios.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? 'No se encontraron resultados' : 'No hay comercios disponibles'}
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Pronto tendremos más opciones para vos'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredComercios}
              renderItem={renderComercioItem}
              keyExtractor={(item) => item.idcomercio.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.comerciosGrid}
              columnWrapperStyle={styles.columnWrapper}
            />
          )}
        </View>
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
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  userGreeting: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  categoriasList: {
    paddingHorizontal: 15,
  },
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
  comerciosGrid: {
    paddingHorizontal: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
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
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
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
});