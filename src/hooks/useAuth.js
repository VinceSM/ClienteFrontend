// src/hooks/useAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import API_CONFIG from '../config/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setUser(null);
      setToken(null);
    } catch (error) {
      console.log('Error checking auth status:', error);
    }
  };

const login = async (email, password) => {
  setIsLoading(true);
  
  try {
    console.log('🔐 Intentando login...');
    console.log('📡 URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log('📡 Status de respuesta:', response.status);

    // Primero obtener el texto de la respuesta
    const responseText = await response.text();
    console.log('📡 Respuesta del servidor (texto):', responseText);

    let data;
    if (responseText && responseText.trim() !== '') {
      try {
        data = JSON.parse(responseText);
        console.log('✅ JSON parseado correctamente:', data);
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        return { 
          success: false, 
          error: 'Error en el formato de respuesta del servidor' 
        };
      }
    } else {
      console.warn('⚠️ Respuesta vacía del servidor');
      data = {};
    }

    // 🔥 MANEJO CORRECTO DE ERROR 401 - CREDENCIALES INCORRECTAS
    if (response.status === 401) {
      console.log('🔐 Error 401 - Credenciales incorrectas');
      return { 
        success: false, 
        error: 'Email o contraseña incorrectos. Por favor, verifica tus credenciales.' 
      };
    }

    if (response.ok) {
      console.log('✅ Login exitoso');
      
      if (data.token) {
        setUser(data.user || { email, nombreCompleto: data.nombreCompleto });
        setToken(data.token);
        
        return { 
          success: true, 
          user: data.user || { email },
          token: data.token 
        };
      } else {
        return { 
          success: false, 
          error: 'No se recibió token del servidor' 
        };
      }
    } else {
      const errorMessage = data.message || data.error || `Error ${response.status}`;
      console.error('❌ Error del servidor:', errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
    
    if (error.message.includes('Network request failed')) {
      return { 
        success: false, 
        error: 'No se puede conectar al servidor. Verifica tu conexión.' 
      };
    } else if (error.message.includes('JSON Parse error')) {
      return { 
        success: false, 
        error: 'Error en la respuesta del servidor' 
      };
    }
    
    return { 
      success: false, 
      error: error.message 
    };
  } finally {
    setIsLoading(false);
  }
};
  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`;
      console.log('🔵 URL de registro:', url);
      console.log('🔵 Datos enviados:', userData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('🟡 Status de respuesta:', response.status);
      
      const responseText = await response.text();
      console.log('🟡 Respuesta del servidor:', responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        return { 
          success: false, 
          error: 'Error en la respuesta del servidor' 
        };
      }

      if (response.ok) {
        console.log('✅ Registro exitoso:', data);
        return { 
          success: true, 
          user: data,
          message: 'Registro exitoso' 
        };
      } else {
        let errorMessage = data.message || 'Error en el registro';
        
        if (response.status === 400) {
          errorMessage = data.message || 'Datos inválidos';
          if (data.errors) {
            const errorDetails = Object.entries(data.errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
            errorMessage += ': ' + errorDetails;
          }
        } else if (response.status === 409) {
          errorMessage = data.message || 'El email ya está registrado';
        } else if (response.status === 500) {
          errorMessage = data.message || 'Error interno del servidor';
        }
        
        console.error('❌ Error del servidor:', errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      
      if (error.message.includes('Network request failed')) {
        return { 
          success: false, 
          error: 'No se puede conectar al servidor. Verifica que esté ejecutándose.' 
        };
      }
      
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}