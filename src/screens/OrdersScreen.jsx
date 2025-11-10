import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

export default function OrdersScreen() {
  const [pedidos, setPedidos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Datos de ejemplo
  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setPedidos([
        {
          id: 1,
          comercio: 'Pizza Paradise',
          fecha: '2024-01-15',
          total: 2500,
          estado: 'entregado',
          items: ['Pizza Margarita', 'Coca Cola 500ml'],
        },
        {
          id: 2,
          comercio: 'Burger House',
          fecha: '2024-01-14',
          total: 1800,
          estado: 'en_camino',
          items: ['Doble Cheese Bacon', 'Papas Fritas'],
        },
      ]);
      setRefreshing(false);
    }, 1000);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'entregado': return '#22C55E';
      case 'en_camino': return '#F59E0B';
      case 'preparando': return '#3B82F6';
      case 'cancelado': return '#EF4444';
      default: return '#666666';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'entregado': return 'Entregado';
      case 'en_camino': return 'En camino';
      case 'preparando': return 'Preparando';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  const renderPedido = ({ item }) => (
    <TouchableOpacity style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <Text style={styles.comercioNombre}>{item.comercio}</Text>
        <Text style={styles.pedidoFecha}>{item.fecha}</Text>
      </View>
      
      <Text style={styles.pedidoItems}>
        {item.items.join(', ')}
      </Text>
      
      <View style={styles.pedidoFooter}>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoText}>
            {getEstadoText(item.estado)}
          </Text>
        </View>
        <Text style={styles.pedidoTotal}>${item.total}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Pedidos</Text>
      </View>

      <FlatList
        data={pedidos}
        renderItem={renderPedido}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadPedidos} />
        }
        contentContainerStyle={styles.pedidosList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tenés pedidos aún</Text>
            <Text style={styles.emptyStateSubtext}>
              Realizá tu primer pedido y aparecerá aquí
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  pedidosList: {
    padding: 16,
  },
  pedidoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  comercioNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  pedidoFecha: {
    fontSize: 14,
    color: '#666666',
  },
  pedidoItems: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  pedidoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pedidoTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});