import { Platform } from 'react-native';

// Detectar automáticamente el entorno y configurar la URL base
const getBaseUrl = () => {
  // Si estamos en React Native
  if (Platform.OS !== 'web') {
    return 'http://192.168.1.40:5189'; // Para React Native (Android/iOS)
  }
  
  // Si estamos en desarrollo web
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1')) {
    return 'https://localhost:7063'; // Para web
  }
  
  // Para producción (ajusta según tu dominio)
  return process.env.API_BASE_URL || 'https://localhost:7063';
};

const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/Auth/login-cliente',
      REGISTER: '/api/Clientes'
    },
    COMERCIOS: {
      BASE: '/api/comercios',
      DESTACADOS: '/api/comercios/destacados',
      BY_CIUDAD: '/api/comercios/ciudad',
      PRODUCTOS: '/api/comercios/{id}/productos'
    },
    CATEGORIAS: {
      PRODUCTOS: '/api/categorias/{id}/productos',
      BUSCAR_PRODUCTOS: '/api/categorias/productos/buscar'
    },
    CLIENTES: '/api/Clientes',
    PEDIDOS: {
      BASE: '/api/pedidos',
      BY_CLIENTE: '/api/pedidos/cliente/{id}',
      BY_REPARTIDOR: '/api/pedidos/repartidor/{id}',
      BY_ESTADO: '/api/pedidos/estado/{estado}',
      TOTAL: '/api/pedidos/{id}/total',
      ESTADO: '/api/pedidos/{id}/estado',
      PAGO: '/api/pedidos/{id}/pago'
    }
  }
};

// Log para debug
console.log('🌍 Environment:', Platform.OS !== 'web' ? 'Mobile' : 'Web');
console.log('🚀 API Base URL:', API_CONFIG.BASE_URL);

export default API_CONFIG;