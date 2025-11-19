import API_CONFIG from '../config/config';

class MetodoPagoService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getAllMetodosPago() {
    try {
      console.log('🔗 Obteniendo métodos de pago desde:', `${this.baseURL}/api/metodos-pago-pedido`);
      
      const response = await fetch(`${this.baseURL}/api/metodos-pago-pedido`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('Respuesta vacía del servidor');
      }

      const data = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      console.log('✅ Métodos de pago obtenidos:', data);
      
      // Filtrar solo métodos activos (si tienen propiedad activo)
      return data.filter(metodo => metodo.activo !== false);
    } catch (error) {
      console.error('❌ Error al obtener métodos de pago:', error);
      throw error;
    }
  }

  async getMetodoPagoById(id) {
    try {
      console.log('🔗 Obteniendo método de pago por ID:', id);
      
      const response = await fetch(`${this.baseURL}/api/metodos-pago-pedido/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('Respuesta vacía del servidor');
      }

      const data = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      console.log('✅ Método de pago obtenido:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener método de pago por ID:', error);
      throw error;
    }
  }

  async getMetodoPagoByNombre(nombre) {
    try {
      console.log('🔗 Obteniendo método de pago por nombre:', nombre);
      
      const response = await fetch(`${this.baseURL}/api/metodos-pago-pedido/metodo/${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('Respuesta vacía del servidor');
      }

      const data = JSON.parse(responseText);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⚠️ Método de pago no encontrado:', nombre);
          return null;
        }
        throw new Error(data.message || `Error ${response.status}`);
      }

      console.log('✅ Método de pago obtenido por nombre:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener método de pago por nombre:', error);
      throw error;
    }
  }
}

export default new MetodoPagoService(); 