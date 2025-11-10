// src/services/authService.js
import API_CONFIG from '../config/config';

class AuthService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseText = await response.text();
    
    if (!responseText) {
      throw new Error('Respuesta vacía del servidor');
    }

    const data = JSON.parse(responseText);

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const responseText = await response.text();
    
    if (!responseText) {
      throw new Error('Respuesta vacía del servidor');
    }

    const data = JSON.parse(responseText);

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  }
}

export default new AuthService();