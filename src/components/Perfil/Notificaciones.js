// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\components\Notificaciones.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';

const Notificaciones = () => {
  const [configuraciones, setConfiguraciones] = useState({
    pedidos: true,
    promociones: true,
    ofertas: false,
    novedades: true,
    recordatorios: false,
    emailMarketing: false,
  });

  const toggleConfiguracion = (key) => {
    setConfiguraciones(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const guardarConfiguraciones = () => {
    // Aquí iría la lógica para guardar en el backend
    Alert.alert('Éxito', 'Configuraciones guardadas correctamente');
  };

  const ConfiguracionItem = ({ title, description, value, onValueChange }) => (
    <View style={styles.configItem}>
      <View style={styles.configText}>
        <Text style={styles.configTitle}>{title}</Text>
        <Text style={styles.configDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#FF4D4D' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones de Pedidos</Text>
          <ConfiguracionItem
            title="Estado de pedidos"
            description="Recibir notificaciones sobre el estado de tus pedidos"
            value={configuraciones.pedidos}
            onValueChange={() => toggleConfiguracion('pedidos')}
          />
          
          <ConfiguracionItem
            title="Recordatorios"
            description="Recordatorios de pedidos pendientes"
            value={configuraciones.recordatorios}
            onValueChange={() => toggleConfiguracion('recordatorios')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promociones y Ofertas</Text>
          <ConfiguracionItem
            title="Promociones especiales"
            description="Ofertas y descuentos exclusivos"
            value={configuraciones.promociones}
            onValueChange={() => toggleConfiguracion('promociones')}
          />
          
          <ConfiguracionItem
            title="Ofertas personalizadas"
            description="Recomendaciones basadas en tus gustos"
            value={configuraciones.ofertas}
            onValueChange={() => toggleConfiguracion('ofertas')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información General</Text>
          <ConfiguracionItem
            title="Novedades"
            description="Nuevos comercios y funcionalidades"
            value={configuraciones.novedades}
            onValueChange={() => toggleConfiguracion('novedades')}
          />
          
          <ConfiguracionItem
            title="Email marketing"
            description="Recibir emails promocionales"
            value={configuraciones.emailMarketing}
            onValueChange={() => toggleConfiguracion('emailMarketing')}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Las notificaciones te mantienen informado sobre tus pedidos y ofertas especiales. 
            Puedes cambiar estas configuraciones en cualquier momento.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Configuración actualizada en tiempo real
        </Text>
        <Text style={styles.footerSubtext}>
          Los cambios se aplican inmediatamente
        </Text>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  configText: {
    flex: 1,
    marginRight: 12,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  configDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#E7F3FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1890FF',
  },
  infoText: {
    fontSize: 14,
    color: '#004085',
    lineHeight: 20,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999999',
  },
});

export default Notificaciones;