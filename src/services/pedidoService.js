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
    const request = {
      ClienteId: pedidoData.clienteId,
      ComercioRepartidor: pedidoData.comercioRepartidor,
      MetodoPagoId: pedidoData.metodoPagoId,
      Items: pedidoData.items.map(item => ({
        ProductoId: item.productoId,
        ComercioId: item.comercioId,
        Cantidad: item.cantidad,
        PrecioUnitario: item.precioUnitario
      }))
    };

    const response = await fetch(`${this.baseURL}/api/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
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