// src/services/pedidoService.js
import API_CONFIG from '../config/config';

class PedidoService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getAllPedidos() {
    const response = await fetch(`${this.baseURL}/api/pedidos`, {
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

    return data;
  }

  async getPedidoById(id) {
    const response = await fetch(`${this.baseURL}/api/pedidos/${id}`, {
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

    return data;
  }

  async getPedidosByCliente(clienteId) {
    const response = await fetch(`${this.baseURL}/api/pedidos/cliente/${clienteId}`, {
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

    return data;
  }

  async getPedidosByRepartidor(repartidorId) {
    const response = await fetch(`${this.baseURL}/api/pedidos/repartidor/${repartidorId}`, {
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

    return data;
  }

  async getPedidosByEstado(estado) {
    const response = await fetch(`${this.baseURL}/api/pedidos/estado/${estado}`, {
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

    return data;
  }

  async createPedido(pedidoData) {
    try {
      console.log('📦 Creando pedido con datos:', JSON.stringify(pedidoData, null, 2));

      // ✅ SOLUCIÓN: Enviar solo los campos que el backend realmente usa
      const request = {
        ClienteId: pedidoData.clienteId,
        MetodoPagoId: pedidoData.metodoPagoId,
        DireccionEnvio: pedidoData.direccionEnvio || pedidoData.direccionEntrega,
        // ❌ ELIMINAR: El backend ignora estos campos y los recalcula
        // SubtotalPedido: pedidoData.subtotalPedido,
        // CostoEnvio: pedidoData.costoEnvio, 
        // TotalPedido: pedidoData.totalPedido,
        ComercioRepartidor: pedidoData.comercioRepartidor,
        Items: pedidoData.items.map(item => ({
          ProductoId: item.productoId,
          ComercioId: item.comercioId,
          Cantidad: item.cantidad,
          PrecioUnitario: item.precioUnitario,
          Total: item.total
        }))
      };

      console.log('📤 Request CORREGIDO al backend:', JSON.stringify(request, null, 2));

      const response = await fetch(`${this.baseURL}/api/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const responseText = await response.text();
      
      console.log('📥 Respuesta del servidor:', {
        status: response.status,
        responseText: responseText
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.errors || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      console.log('✅ Pedido creado exitosamente:', data);
      return data;

    } catch (error) {
      console.error('❌ Error en createPedido:', error);
      throw error;
    }
  }

  async updateEstadoPedido(id, nuevoEstado) {
    const response = await fetch(`${this.baseURL}/api/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(nuevoEstado),
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

  async updatePagoPedido(id, pagado) {
    const response = await fetch(`${this.baseURL}/api/pedidos/${id}/pago`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(pagado),
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

  async deletePedido(id) {
    const response = await fetch(`${this.baseURL}/api/pedidos/${id}`, {
      method: 'DELETE',
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

    return data;
  }

  async getTotalPedido(id) {
    const response = await fetch(`${this.baseURL}/api/pedidos/${id}/total`, {
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

    return data;
  }
}

export default new PedidoService();