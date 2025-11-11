import API_CONFIG from '../config/config';

class HorarioService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getHorariosPorComercio(comercioId) {
    try {
      console.log('🔵 Fetching horarios for comercio:', `${this.baseURL}/api/ComercioHorarios/${comercioId}/horarios`);
      
      const response = await fetch(`${this.baseURL}/api/ComercioHorarios/${comercioId}/horarios`);
      
      console.log('🟡 Response status:', response.status);
      
      if (!response.ok) {
        // Si no hay horarios, no es un error, retornamos array vacío
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Horarios data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching horarios:', error);
      // Retornamos array vacío en caso de error
      return [];
    }
  }

  async crearHorario(comercioId, horario) {
    try {
      const response = await fetch(`${this.baseURL}/api/ComercioHorarios/${comercioId}/horarios/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(horario),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creando horario:', error);
      throw error;
    }
  }
}

export default new HorarioService();