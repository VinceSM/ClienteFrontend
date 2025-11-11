// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\components\MisPedidos.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import PerfilService from '../../services/perfilService';

const MisPedidos = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarPedidos = async () => {
    try {
      if (user?.idcliente) {
        const pedidosData = await PerfilService.getPedidosByCliente(user.idcliente);
        setPedidos(pedidosData);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarPedidos();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoId}>Pedido #{item.idpedido}</Text>
        <Text style={[
          styles.estado,
          item.estado?.tipo === 'Entregado' ? styles.estadoEntregado : 
          item.estado?.tipo === 'En camino' ? styles.estadoEnCamino : styles.estadoPendiente
        ]}>
          {item.estado?.tipo || 'Pendiente'}
        </Text>
      </View>
      
      <Text style={styles.fecha}>
        {new Date(item.fecha).toLocaleDateString()} - {item.hora}
      </Text>
      
      <Text style={styles.total}>Total: ${item.subtotalPedido}</Text>
      
      <View style={styles.detalles}>
        <Text style={styles.detallesText}>
          {item.itemsPedido?.length || 0} productos
        </Text>
        <Text style={styles.detallesText}>
          {item.metodoPago?.metodo || 'Efectivo'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>
      
      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes pedidos realizados</Text>
          <Text style={styles.emptySubtext}>
            Cuando hagas un pedido, aparecerá aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={(item) => item.idpedido.toString()}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  pedidoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  estado: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoPendiente: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  estadoEnCamino: {
    backgroundColor: '#CCE5FF',
    color: '#004085',
  },
  estadoEntregado: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  fecha: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  detalles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detallesText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default MisPedidos;