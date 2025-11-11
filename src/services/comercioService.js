import API_CONFIG from '../config/config';

class ComercioService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getAllComercios() {
    try {
      console.log('🔵 Fetching comercios from:', `${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}`);
      
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}`);
      
      console.log('🟡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Comercios data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching comercios:', error);
      throw error;
    }
  }

async getComercioById(id) {
  try {
    console.log('🔵 Fetching comercio by ID:', `${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}`);
    
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${id}`);
    
    console.log('🟡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Comercio data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching comercio:', error);
    throw error;
  }
}

  async getComerciosDestacados() {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.DESTACADOS}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching comercios destacados:', error);
      throw error;
    }
  }

  async getComerciosByCiudad(ciudad) {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BY_CIUDAD}/${ciudad}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching comercios por ciudad:', error);
      throw error;
    }
  }

async getProductosByComercio(comercioId) {
  try {
    console.log('🔵 Fetching productos for comercio:', `${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${comercioId}/productos`);
    
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/${comercioId}/productos`);
    
    console.log('🟡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Productos data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching productos:', error);
    throw error;
  }
}

async getComercioPanelDetalle(id) {
  try {
    console.log('🔵 Fetching comercio panel detalle:', `${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/panel/${id}`);
    
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COMERCIOS.BASE}/panel/${id}`);
    
    console.log('🟡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Comercio panel data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching comercio panel:', error);
    throw error;
  }
}

}

export default new ComercioService();