const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:5189',
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

export default API_CONFIG;