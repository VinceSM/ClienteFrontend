import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConfirmarPedidoModal = memo(({
  visible,
  onClose,
  onConfirm,
  loading,
  carrito,
  comercio,
  metodosPago,
  metodoPagoSeleccionado,
  onMetodoPagoChange,
  loadingMetodos,
  formatPrecio,
  totalConEnvio
}) => {
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const handleDireccionChange = useCallback((text) => {
    setDireccion(text);
  }, []);

  const handleObservacionesChange = useCallback((text) => {
    setObservaciones(text);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(direccion, observaciones);
  }, [onConfirm, direccion, observaciones]);

  const getMetodoPagoIcon = useCallback((metodo) => {
    switch (metodo?.toUpperCase()) {
      case 'EFECTIVO':
        return 'cash';
      case 'TARJETA':
        return 'card';
      case 'TRANSFERENCIA':
        return 'business';
      case 'MERCADO PAGO':
        return 'phone-portrait';
      default:
        return 'wallet';
    }
  }, []);

  const renderMetodoPago = useCallback((metodo) => (
    <TouchableOpacity
      key={metodo.idmetodo}
      style={[
        styles.pagoOption,
        metodoPagoSeleccionado?.idmetodo === metodo.idmetodo && styles.pagoOptionSelected
      ]}
      onPress={() => onMetodoPagoChange(metodo)}
    >
      <Ionicons 
        name={getMetodoPagoIcon(metodo.metodo)} 
        size={24} 
        color={metodoPagoSeleccionado?.idmetodo === metodo.idmetodo ? '#FF6B6B' : '#666'} 
      />
      <View style={styles.pagoOptionInfo}>
        <Text style={[
          styles.pagoOptionText,
          metodoPagoSeleccionado?.idmetodo === metodo.idmetodo && styles.pagoOptionTextSelected
        ]}>
          {metodo.metodo}
        </Text>
        {metodo.descripcion && (
          <Text style={styles.pagoOptionDesc}>
            {metodo.descripcion}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  ), [metodoPagoSeleccionado, getMetodoPagoIcon, onMetodoPagoChange]);

  const renderResumenItem = useCallback((item, index) => (
    <View key={index} style={styles.resumenItem}>
      <Text style={styles.resumenNombre}>
        {item.cantidad}x {item.producto.nombre}
      </Text>
      <Text style={styles.resumenPrecio}>
        {formatPrecio(item.producto.precioUnitario * item.cantidad)}
      </Text>
    </View>
  ), [formatPrecio]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Realizar Pedido</Text>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>📍 Dirección de entrega *</Text>
            <TextInput
              style={styles.direccionInput}
              value={direccion}
              onChangeText={handleDireccionChange}
              placeholder="Ej: Calle 99 entre 99 y 99 N 1099, Piso 9 Numero 9"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
              autoCorrect={true}
              autoComplete="street-address"
              importantForAutofill="yes"
            />
            {!direccion.trim() && (
              <Text style={styles.errorText}>
                La dirección de entrega es obligatoria
              </Text>
            )}
          </View>

          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>💳 Método de pago</Text>
            {loadingMetodos ? (
              <ActivityIndicator size="small" color="#FF6B6B" />
            ) : (
              <View style={styles.pagoOptions}>
                {metodosPago.map(renderMetodoPago)}
              </View>
            )}
          </View>

          <View style={styles.confirmSection}>
            <Text style={styles.sectionTitle}>📦 Resumen del pedido</Text>
            <View style={styles.resumenContainer}>
              {carrito.map(renderResumenItem)}
              
              {comercio?.envio > 0 && (
                <View style={styles.resumenItem}>
                  <Text style={styles.resumenNombre}>Costo de envío</Text>
                  <Text style={styles.resumenPrecio}>
                    {formatPrecio(comercio.envio)}
                  </Text>
                </View>
              )}
              
              <View style={styles.resumenTotal}>
                <Text style={styles.resumenTotalLabel}>Total:</Text>
                <Text style={styles.resumenTotalPrecio}>
                  {formatPrecio(totalConEnvio)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Ionicons name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Tu pedido será creado con estado "PENDIENTE". El comercio te notificará cuando sea confirmado.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={[
              styles.confirmarButton,
              (!direccion.trim() || loading || !metodoPagoSeleccionado) && styles.confirmarButtonDisabled
            ]}
            onPress={handleConfirm}
            disabled={!direccion.trim() || loading || !metodoPagoSeleccionado}
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
});

const styles = StyleSheet.create({
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
  pagoOptionInfo: {
    flex: 1,
    marginLeft: 8,
  },
  pagoOptionDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    lineHeight: 18,
  },
});

export default ConfirmarPedidoModal;