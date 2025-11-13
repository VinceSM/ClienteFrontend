// src/config/config.js
import { Platform } from 'react-native';

// Detectar automáticamente el entorno y configurar la URL base
const getBaseUrl = () => {
  // Si estamos en React Native
  if (Platform.OS !== 'web') {
    return 'http://192.168.1.35:5189'; // Para React Native (Android/iOS)
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
    CLIENTES: '/api/Clientes'
  }
};

// Log para debug
console.log('🌍 Environment:', Platform.OS !== 'web' ? 'Mobile' : 'Web');
console.log('🚀 API Base URL:', API_CONFIG.BASE_URL);

export default API_CONFIG;