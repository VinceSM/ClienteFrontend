import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../hooks/useAuth';
import comercioService from '../services/comercioService';

// Componentes comunes
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorScreen from '../components/common/ErrorScreen';

// Componentes layout
import SectionHeader from '../components/layout/SectionHeader';

// Componentes home
import CategoryList from '../components/home/CategoryList';
import CommerceList from '../components/home/CommerceList';
import EmptyState from '../components/home/EmptyState';

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
      setCategorias(generateCategories(comerciosData));

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('No se pudieron cargar los comercios');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const generateCategories = (comerciosData) => {
    const tiposUnicos = [...new Set(comerciosData.map(c => c.tipoComercio))].filter(Boolean);
    const categoriasReales = tiposUnicos.map((tipo, index) => ({
      id: index + 1,
      nombre: tipo,
      icon: getIconForCategory(tipo)
    }));

    if (categoriasReales.length === 0) {
      return [
        { id: 1, nombre: 'Restaurante', icon: '🍽️' },
        { id: 2, nombre: 'Comida Rápida', icon: '🍔' },
        { id: 3, nombre: 'Pizzería', icon: '🍕' },
        { id: 4, nombre: 'Postres', icon: '🍰' },
      ];
    }

    return categoriasReales;
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

  const handleCommercePress = (comercio) => {
    navigation.navigate('Restaurant', { comercio });
  };

  const handleCategoryPress = (category) => {
    // Aquí puedes implementar la navegación por categoría
    console.log('Categoría seleccionada:', category.nombre);
  };

  // Filtrar comercios basado en búsqueda
  const filteredComercios = comercios.filter(comercio => 
    comercio.nombreComercio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comercio.tipoComercio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingScreen message="Cargando comercios..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorScreen 
          error={error}
          subtext="Verifica que el backend esté ejecutándose"
          onRetry={loadData}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      
      {/* Header */}
      <Header navigation={navigation} />

      {/* Buscador */}
      <View style={styles.searchSection}>
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
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
          <SectionHeader 
            title="Categorías" 
            showSeeAll={true}
          />
          <CategoryList 
            categories={categorias}
            onCategoryPress={handleCategoryPress}
          />
        </View>

        {/* Comercios */}
        <View style={styles.section}>
          <SectionHeader 
            title={
              filteredComercios.length === 1 
                ? '1 comercio disponible' 
                : `${filteredComercios.length} comercios disponibles`
            }
          />
          
          {filteredComercios.length === 0 ? (
            <EmptyState 
              title={searchQuery ? 'No se encontraron resultados' : 'No hay comercios disponibles'}
              message={
                searchQuery 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Pronto tendremos más opciones para vos'
              }
            />
          ) : (
            <CommerceList 
              comercios={filteredComercios}
              onCommercePress={handleCommercePress}
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
  searchSection: {
    backgroundColor: '#FF6B6B',
    paddingBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
});