const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:5189/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register'
    },
    CLIENTE: '/cliente'
  }
};

export default API_CONFIG;