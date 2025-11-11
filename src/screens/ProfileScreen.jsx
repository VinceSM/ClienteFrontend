// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\screens\ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import PerfilService from '../services/perfilService';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, logout, actualizarDireccion, recargarPerfil } = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [direccionEdit, setDireccionEdit] = useState({
    calle: '',
    numero: '',
    ciudad: ''
  });

  // Debug: Mostrar datos del usuario
  useEffect(() => {
    console.log('🔍 ProfileScreen - User data:', user);
    console.log('🔍 ProfileScreen - User properties:', {
      nombreCompleto: user?.nombreCompleto,
      email: user?.email,
      celular: user?.celular,
      calle: user?.calle,
      numero: user?.numero,
      ciudad: user?.ciudad,
      idcliente: user?.idcliente,
      id: user?.id 
    });
  }, [user]);

  // Inicializar datos de dirección cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      setDireccionEdit({
        calle: user?.calle || '',
        numero: user?.numero?.toString() || '',
        ciudad: user?.ciudad || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      console.log("🔐 Cerrando sesión...");
      
      // Mostrar confirmación (igual que en comercio)
      const confirmLogout = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
      if (!confirmLogout) return;
      
      // Ejecutar logout
      const success = await logout();
      
      if (success) {
        console.log("✅ Sesión cerrada exitosamente");
        // El AppNavigator debería redirigir automáticamente
      } else {
        console.error("❌ Error al cerrar sesión");
        alert("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("💥 Error en logout:", error);
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  const handleEditarDireccion = () => {
    setModalVisible(true);
  };

  const guardarDireccion = async () => {
    try {
      if (!direccionEdit.calle || !direccionEdit.numero || !direccionEdit.ciudad) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      setLoading(true);
      await actualizarDireccion({
        calle: direccionEdit.calle,
        numero: parseInt(direccionEdit.numero),
        ciudad: direccionEdit.ciudad
      });
      
      setModalVisible(false);
      Alert.alert('Éxito', 'Dirección actualizada correctamente');
    } catch (error) {
      console.error('Error guardando dirección:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const navegarAMisPedidos = () => {
    navigation.navigate('MisPedidos');
  };

  const navegarAMetodosPago = () => {
    navigation.navigate('MetodosPago');
  };

  const navegarANotificaciones = () => {
    navigation.navigate('Notificaciones');
  };

  const navegarAAyuda = () => {
    navigation.navigate('Ayuda');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Información del usuario */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nombreCompleto?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.nombreCompleto || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Email no disponible'}</Text>
            <Text style={styles.userPhone}>{user?.celular || 'Teléfono no disponible'}</Text>
          </View>
        </View>

        {/* Dirección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Dirección</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>
              {user?.calle && user?.numero && user?.ciudad 
                ? `${user.calle} ${user.numero}, ${user.ciudad}`
                : 'Dirección no configurada'
              }
            </Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditarDireccion}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={navegarAMisPedidos}
          >
            <Text style={styles.optionText}>Mis Pedidos</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={navegarAMetodosPago}
          >
            <Text style={styles.optionText}>Métodos de Pago</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={navegarANotificaciones}
          >
            <Text style={styles.optionText}>Notificaciones</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={navegarAAyuda}
          >
            <Text style={styles.optionText}>Ayuda</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para editar dirección */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Dirección</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Calle"
              value={direccionEdit.calle}
              onChangeText={(text) => setDireccionEdit({...direccionEdit, calle: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Número"
              value={direccionEdit.numero}
              onChangeText={(text) => setDireccionEdit({...direccionEdit, numero: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Ciudad"
              value={direccionEdit.ciudad}
              onChangeText={(text) => setDireccionEdit({...direccionEdit, ciudad: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={guardarDireccion}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  reloadButton: {
    padding: 8,
  },
  reloadButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4D4D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  debugText: {
    fontSize: 10,
    color: '#999999',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    marginRight: 12,
  },
  editButton: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  optionArrow: {
    fontSize: 20,
    color: '#666666',
  },
  debugButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginTop: 10,
  },
  debugButtonText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    width: '85%',
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