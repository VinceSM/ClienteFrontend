// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\services\perfilService.js
import API_CONFIG from '../config/config';

class PerfilService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Método auxiliar para obtener el token
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Método auxiliar para headers comunes
  getHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async getClienteById(id) {
    try {
      const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.CLIENTES}/${id}`;
      console.log('🔵 Fetching cliente from:', url);
      console.log('🔑 Token disponible:', !!this.getAuthToken());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      console.log('🟡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('No autorizado - Token inválido o expirado');
        } else if (response.status === 404) {
          throw new Error('Cliente no encontrado');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Cliente data recibida:', data);
      
      // Verificar que tenemos los datos esperados
      if (!data) {
        throw new Error('No se recibieron datos del cliente');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching cliente:', error);
      throw error;
    }
  }

  async updateCliente(id, datosCliente) {
    try {
      const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.CLIENTES}/${id}`;
      console.log('🔵 Updating cliente:', url);
      console.log('📦 Data to update:', datosCliente);
      console.log('🔑 Token disponible:', !!this.getAuthToken());
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(datosCliente),
      });
      
      console.log('🟡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('No autorizado - Token inválido o expirado');
        } else if (response.status === 404) {
          throw new Error('Cliente no encontrado');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Cliente updated:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating cliente:', error);
      throw error;
    }
  }

  async updateDireccion(id, direccion) {
    try {
      const datosActualizados = {
        calle: direccion.calle,
        numero: direccion.numero,
        ciudad: direccion.ciudad
      };
      
      const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.CLIENTES}/${id}`;
      console.log('🔵 Updating dirección:', url);
      console.log('📦 Dirección data:', datosActualizados);
      console.log('🔑 Token disponible:', !!this.getAuthToken());
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(datosActualizados),
      });
      
      console.log('🟡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('No autorizado - Token inválido o expirado');
        } else if (response.status === 404) {
          throw new Error('Cliente no encontrado');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Dirección updated:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating dirección:', error);
      throw error;
    }
  }

  async getPedidosByCliente(clienteId) {
    try {
      // NOTA: Este endpoint probablemente no existe aún
      // Podemos implementarlo después en el backend
      console.warn('⚠️ Endpoint de pedidos no implementado aún');
      return []; // Retornar array vacío por ahora
      
      /* Código comentado para cuando implementemos el endpoint:
      const url = `${this.baseURL}/api/Clientes/${clienteId}/pedidos`;
      console.log('🔵 Fetching pedidos for cliente:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      console.log('🟡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Pedidos data:', data);
      return data;
      */
    } catch (error) {
      console.error('❌ Error fetching pedidos:', error);
      return []; // Retornar array vacío en caso de error
    }
  }

  // Método para obtener TODOS los clientes (útil para debug)
  async getAllClientes() {
    try {
      const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.CLIENTES}`;
      console.log('🔵 Fetching todos los clientes:', url);
      console.log('🔑 Token disponible:', !!this.getAuthToken());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      console.log('🟡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Todos los clientes:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching todos los clientes:', error);
      throw error;
    }
  }

  // Método para buscar cliente por email (si no tenemos el ID)
  async buscarClientePorEmail(email) {
    try {
      // Primero obtenemos todos los clientes
      const todosClientes = await this.getAllClientes();
      
      // Buscamos por email
      const clienteEncontrado = todosClientes.find(cliente => 
        cliente.email && cliente.email.toLowerCase() === email.toLowerCase()
      );
      
      console.log('🔍 Cliente encontrado por email:', clienteEncontrado);
      return clienteEncontrado || null;
    } catch (error) {
      console.error('❌ Error buscando cliente por email:', error);
      return null;
    }
  }
}

export default new PerfilService();