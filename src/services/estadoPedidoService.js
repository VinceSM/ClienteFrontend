import API_CONFIG from '../config/config';

class EstadoPedidoService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getAllEstados() {
    try {
      console.log('🔗 Obteniendo estados de pedido desde:', `${this.baseURL}/api/estados-pedido`);
      
      const response = await fetch(`${this.baseURL}/api/estados-pedido`, {
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

      console.log('✅ Estados de pedido obtenidos:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener estados de pedido:', error);
      throw error;
    }
  }

  async getEstadoById(id) {
    try {
      console.log('🔗 Obteniendo estado de pedido por ID:', id);
      
      const response = await fetch(`${this.baseURL}/api/estados-pedido/${id}`, {
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

      console.log('✅ Estado de pedido obtenido:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener estado de pedido por ID:', error);
      throw error;
    }
  }

  async getEstadoByTipo(tipo) {
    try {
      console.log('🔗 Obteniendo estado de pedido por tipo:', tipo);
      
      const response = await fetch(`${this.baseURL}/api/estados-pedido/tipo/${encodeURIComponent(tipo)}`, {
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
          console.log('⚠️ Estado de pedido no encontrado, usando fallback para:', tipo);
          // Fallback para estado PENDIENTE
          return { idestado: 1, tipo: 'PENDIENTE', descripcion: 'Pedido pendiente de confirmación' };
        }
        throw new Error(data.message || `Error ${response.status}`);
      }

      console.log('✅ Estado de pedido obtenido por tipo:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener estado de pedido por tipo:', error);
      // Fallback en caso de error
      return { idestado: 1, tipo: 'PENDIENTE', descripcion: 'Pedido pendiente de confirmación' };
    }
  }
}

export default new EstadoPedidoService();