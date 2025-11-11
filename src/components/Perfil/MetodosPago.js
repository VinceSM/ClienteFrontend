// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\components\MetodosPago.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

const MetodosPago = () => {
  const [metodosPago, setMetodosPago] = useState([
    {
      id: 1,
      tipo: 'Efectivo',
      numero: 'Pago al momento de la entrega',
      principal: true,
    },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoMetodo, setNuevoMetodo] = useState({
    tipo: 'Tarjeta',
    numero: '',
    vencimiento: '',
    cvv: '',
    titular: '',
  });

  const agregarMetodoPago = () => {
    if (!nuevoMetodo.numero || !nuevoMetodo.vencimiento || !nuevoMetodo.cvv || !nuevoMetodo.titular) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const nuevoId = Math.max(...metodosPago.map(m => m.id)) + 1;
    const nuevo = {
      id: nuevoId,
      tipo: nuevoMetodo.tipo,
      numero: `•••• ${nuevoMetodo.numero.slice(-4)}`,
      vencimiento: nuevoMetodo.vencimiento,
      principal: false,
    };

    setMetodosPago([...metodosPago, nuevo]);
    setModalVisible(false);
    setNuevoMetodo({
      tipo: 'Tarjeta',
      numero: '',
      vencimiento: '',
      cvv: '',
      titular: '',
    });
    
    Alert.alert('Éxito', 'Método de pago agregado correctamente');
  };

  const establecerComoPrincipal = (id) => {
    const actualizados = metodosPago.map(metodo => ({
      ...metodo,
      principal: metodo.id === id,
    }));
    setMetodosPago(actualizados);
  };

  const eliminarMetodo = (id) => {
    if (metodosPago.find(m => m.id === id)?.principal) {
      Alert.alert('Error', 'No puedes eliminar el método de pago principal');
      return;
    }

    Alert.alert(
      'Eliminar método de pago',
      '¿Estás seguro de que quieres eliminar este método de pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setMetodosPago(metodosPago.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Métodos de Pago</Text>

      <ScrollView style={styles.scrollView}>
        {metodosPago.map((metodo) => (
          <View key={metodo.id} style={styles.metodoCard}>
            <View style={styles.metodoInfo}>
              <Text style={styles.metodoTipo}>{metodo.tipo}</Text>
              <Text style={styles.metodoNumero}>{metodo.numero}</Text>
              {metodo.vencimiento && (
                <Text style={styles.metodoDetalle}>
                  Vence: {metodo.vencimiento}
                </Text>
              )}
            </View>
            
            <View style={styles.metodoActions}>
              {metodo.principal ? (
                <View style={styles.principalBadge}>
                  <Text style={styles.principalText}>Principal</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.principalButton}
                  onPress={() => establecerComoPrincipal(metodo.id)}
                >
                  <Text style={styles.principalButtonText}>Establecer principal</Text>
                </TouchableOpacity>
              )}
              
              {!metodo.principal && (
                <TouchableOpacity
                  style={styles.eliminarButton}
                  onPress={() => eliminarMetodo(metodo.id)}
                >
                  <Text style={styles.eliminarButtonText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.agregarButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.agregarButtonText}>+ Agregar método de pago</Text>
      </TouchableOpacity>

      {/* Modal para agregar nuevo método de pago */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Tarjeta</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              value={nuevoMetodo.numero}
              onChangeText={(text) => setNuevoMetodo({...nuevoMetodo, numero: text})}
              keyboardType="numeric"
              maxLength={16}
            />
            
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/AA"
                value={nuevoMetodo.vencimiento}
                onChangeText={(text) => setNuevoMetodo({...nuevoMetodo, vencimiento: text})}
                maxLength={5}
              />
              
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                value={nuevoMetodo.cvv}
                onChangeText={(text) => setNuevoMetodo({...nuevoMetodo, cvv: text})}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del titular"
              value={nuevoMetodo.titular}
              onChangeText={(text) => setNuevoMetodo({...nuevoMetodo, titular: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={agregarMetodoPago}
              >
                <Text style={styles.saveButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  metodoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metodoInfo: {
    flex: 1,
  },
  metodoTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  metodoNumero: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  metodoDetalle: {
    fontSize: 12,
    color: '#666666',
  },
  metodoActions: {
    alignItems: 'flex-end',
  },
  principalBadge: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  principalText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  principalButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  principalButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eliminarButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  eliminarButtonText: {
    color: '#DC3545',
    fontSize: 12,
  },
  agregarButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  agregarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#FF4D4D',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MetodosPago;