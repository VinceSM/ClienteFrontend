// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\components\Ayuda.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

const Ayuda = () => {
  const [faqAbierto, setFaqAbierto] = useState(null);

  const faqs = [
    {
      id: 1,
      pregunta: '¿Cómo realizo un pedido?',
      respuesta: 'Para realizar un pedido:\n\n1. Selecciona un comercio\n2. Agrega productos al carrito\n3. Revisa tu pedido\n4. Elige método de pago\n5. Confirma tu pedido',
    },
    {
      id: 2,
      pregunta: '¿Cuáles son los métodos de pago disponibles?',
      respuesta: 'Aceptamos:\n• Efectivo\n• Tarjetas de crédito/débito\n• Transferencias bancarias\n• Billeteras virtuales',
    },
    {
      id: 3,
      pregunta: '¿Puedo modificar o cancelar mi pedido?',
      respuesta: 'Puedes modificar o cancelar tu pedido siempre que el comercio no haya comenzado a prepararlo. Ve a "Mis Pedidos" y selecciona la opción correspondiente.',
    },
    {
      id: 4,
      pregunta: '¿Qué hago si tengo un problema con mi pedido?',
      respuesta: 'Contacta a nuestro soporte:\n• Chat en la app\n• Teléfono: 0800-123-4567\n• Email: soporte@deliveryya.com',
    },
    {
      id: 5,
      pregunta: '¿Cómo funciona el sistema de repartidores?',
      respuesta: 'Los repartidores son verificados y asignados automáticamente según tu ubicación. Puedes seguir en tiempo real el estado de tu entrega.',
    },
  ];

  const toggleFaq = (id) => {
    setFaqAbierto(faqAbierto === id ? null : id);
  };

  const contactarSoporte = () => {
    Alert.alert(
      'Contactar Soporte',
      'Elige cómo quieres contactarnos:',
      [
        {
          text: 'Llamar',
          onPress: () => Linking.openURL('tel:08001234567'),
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:soporte@deliveryya.com'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const abrirWhatsApp = () => {
    Linking.openURL('https://wa.me/5491112345678?text=Hola, necesito ayuda con mi pedido');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centro de Ayuda</Text>

      <ScrollView style={styles.scrollView}>
        {/* Contacto rápido */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contacto Rápido</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={[styles.contactButton, styles.whatsappButton]}
              onPress={abrirWhatsApp}
            >
              <Text style={styles.contactButtonText}>💬 WhatsApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.contactButton, styles.phoneButton]}
              onPress={contactarSoporte}
            >
              <Text style={styles.contactButtonText}>📞 Llamar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preguntas frecuentes */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
          
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqPregunta}
                onPress={() => toggleFaq(faq.id)}
              >
                <Text style={styles.faqPreguntaText}>{faq.pregunta}</Text>
                <Text style={styles.faqIcon}>
                  {faqAbierto === faq.id ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              
              {faqAbierto === faq.id && (
                <View style={styles.faqRespuesta}>
                  <Text style={styles.faqRespuestaText}>
                    {faq.respuesta}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Información de contacto */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📞 Teléfono:</Text>
            <Text style={styles.infoValue}>0800-123-4567</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>✉️ Email:</Text>
            <Text style={styles.infoValue}>soporte@deliveryya.com</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>🕒 Horario:</Text>
            <Text style={styles.infoValue}>Lunes a Domingo, 8:00 - 24:00</Text>
          </View>
        </View>

        {/* Tips útiles */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tips Útiles</Text>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>1</Text>
            <Text style={styles.tipText}>
              Mantén tu aplicación actualizada para mejores funciones
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>2</Text>
            <Text style={styles.tipText}>
              Verifica tu dirección antes de confirmar el pedido
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>3</Text>
            <Text style={styles.tipText}>
              Califica tu experiencia para ayudarnos a mejorar
            </Text>
          </View>
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  phoneButton: {
    backgroundColor: '#FF4D4D',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  faqPregunta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqPreguntaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 12,
  },
  faqIcon: {
    fontSize: 12,
    color: '#666666',
  },
  faqRespuesta: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  faqRespuestaText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1890FF',
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1890FF',
    marginRight: 12,
    backgroundColor: '#E6F7FF',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    lineHeight: 20,
  },
});

export default Ayuda;