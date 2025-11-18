// C:\Users\ASUS\DeliveryYa\ClienteFronted\src\hooks\useAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/config';
import PerfilService from '../services/perfilService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // REEMPLAZADO: AsyncStorage en lugar de localStorage
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        console.log('✅ Usuario autenticado encontrado:', userData);
        
        // Cargar datos frescos si tenemos ID
        if (userData.idcliente || userData.id) {
          try {
            const clienteId = userData.idcliente || userData.id;
            const clienteActual = await PerfilService.getClienteById(clienteId);
            setUser(clienteActual);
            await AsyncStorage.setItem('userData', JSON.stringify(clienteActual));
          } catch (error) {
            console.error('❌ Error cargando datos frescos:', error);
          }
        }
      } else {
        console.log('❌ No hay usuario autenticado');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Intentando login...');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Status de respuesta:', response.status);

      const responseText = await response.text();
      console.log('📡 Respuesta del servidor:', responseText);

      let data;
      if (responseText && responseText.trim() !== '') {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Error en el formato de respuesta del servidor');
        }
      }

      if (response.status === 401) {
        throw new Error('Email o contraseña incorrectos');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error ${response.status}`);
      }

      if (data.token) {
        // REEMPLAZADO: Guardar token con AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);
        setToken(data.token);
        
        // Obtener perfil completo
        try {
          let clienteCompleto;
          if (data.idcliente || data.id) {
            const clienteId = data.idcliente || data.id;
            clienteCompleto = await PerfilService.getClienteById(clienteId);
          } else if (data.user?.idcliente || data.user?.id) {
            const clienteId = data.user.idcliente || data.user.id;
            clienteCompleto = await PerfilService.getClienteById(clienteId);
          } else {
            const userEmail = data.email || data.user?.email || email;
            clienteCompleto = await PerfilService.buscarClientePorEmail(userEmail);
          }
          
          if (clienteCompleto) {
            setUser(clienteCompleto);
            // REEMPLAZADO: Guardar usuario con AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(clienteCompleto));
            console.log('✅ Login exitoso:', clienteCompleto);
            return { success: true, user: clienteCompleto, token: data.token };
          }
        } catch (profileError) {
          console.error('Error cargando perfil completo:', profileError);
        }
        
        // Fallback a datos básicos
        const userBasico = data.user || { email, nombreCompleto: data.nombreCompleto || 'Usuario' };
        setUser(userBasico);
        // REEMPLAZADO: Guardar usuario con AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userBasico));
        return { success: true, user: userBasico, token: data.token };
        
      } else {
        throw new Error('No se recibió token del servidor');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        throw new Error('Error en la respuesta del servidor');
      }

      if (response.ok) {
        console.log('✅ Registro exitoso:', data);
        
        if (data.token) {
          // REEMPLAZADO: Guardar token con AsyncStorage
          await AsyncStorage.setItem('authToken', data.token);
          setToken(data.token);
          
          // Intentar obtener perfil completo
          try {
            const userEmail = data.email || data.user?.email || userData.email;
            const clienteCompleto = await PerfilService.buscarClientePorEmail(userEmail);
            if (clienteCompleto) {
              setUser(clienteCompleto);
              // REEMPLAZADO: Guardar usuario con AsyncStorage
              await AsyncStorage.setItem('userData', JSON.stringify(clienteCompleto));
            } else {
              const userBasico = { email: userEmail, nombreCompleto: userData.nombreCompleto };
              setUser(userBasico);
              // REEMPLAZADO: Guardar usuario con AsyncStorage
              await AsyncStorage.setItem('userData', JSON.stringify(userBasico));
            }
          } catch (error) {
            console.error('Error obteniendo perfil completo:', error);
            const userBasico = { email: userData.email, nombreCompleto: userData.nombreCompleto };
            setUser(userBasico);
            // REEMPLAZADO: Guardar usuario con AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(userBasico));
          }
        }
        
        return { success: true, user: data.user || data, message: 'Registro exitoso' };
      } else {
        let errorMessage = data.message || 'Error en el registro';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 LOGOUT ACTUALIZADO con AsyncStorage
  const logout = async () => {
    return new Promise(async (resolve) => {
      try {
        console.log('🚪 Ejecutando logout...');
        
        // REEMPLAZADO: Limpiar con AsyncStorage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
        setUser(null);
        setToken(null);
        setError(null);
        
        console.log('✅ Estado limpiado');
        
        // Pequeño delay para asegurar que React actualice el estado
        setTimeout(() => {
          console.log('🔄 Logout completado');
          resolve(true);
        }, 100);
        
      } catch (error) {
        console.error('❌ Error en logout:', error);
        setError(error.message);
        resolve(false);
      }
    });
  };

  const clearError = () => {
    setError(null);
  };

  // 🔄 FUNCIONES PARA MANEJAR EL PERFIL (ACTUALIZADAS con AsyncStorage)
  const actualizarPerfil = async (datosActualizados) => {
    try {
      if (!user?.id) {
        throw new Error('ID de cliente no disponible');
      }
      
      console.log('🔄 Actualizando perfil...');
      const perfilActualizado = await PerfilService.updateCliente(user.id, datosActualizados);
      const nuevoUser = { ...user, ...perfilActualizado };
      
      setUser(nuevoUser);
      // REEMPLAZADO: Guardar con AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(nuevoUser));
      console.log('✅ Perfil actualizado:', nuevoUser);
      
      return perfilActualizado;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  };

const actualizarDireccion = async (direccion) => {
  try {
    const resultado = await PerfilService.updateDireccion(user.id, direccion);
    
    const usuarioActualizado = { ...user, ...direccion };
    setUser(usuarioActualizado);
    await AsyncStorage.setItem('userData', JSON.stringify(usuarioActualizado));
    
    return resultado;
  } catch (error) {
    console.error('Error actualizando dirección:', error);
    throw error;
  }
};

  const cargarDatosCliente = async (clienteId) => {
    try {
      console.log('🔄 Cargando datos del cliente...');
      const clienteData = await PerfilService.getClienteById(clienteId);
      setUser(clienteData);
  
      await AsyncStorage.setItem('userData', JSON.stringify(clienteData));
      console.log('✅ Datos del cliente cargados:', clienteData);
      return clienteData;
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
      throw error;
    }
  };

  const recargarPerfil = async () => {
    try {
      if (user?.id) {
        console.log('🔄 Forzando recarga del perfil...');
        return await cargarDatosCliente(user.id);
      } else if (user?.email) {
        console.log('🔄 Buscando perfil por email...');
        const clientePorEmail = await PerfilService.buscarClientePorEmail(user.email);
        if (clientePorEmail) {
          setUser(clientePorEmail);
 
          await AsyncStorage.setItem('userData', JSON.stringify(clientePorEmail));
          console.log('✅ Perfil recargado por email:', clientePorEmail);
          return clientePorEmail;
        } else {
          throw new Error('No se pudo encontrar el perfil por email');
        }
      } else {
        console.warn('⚠️ No hay ID de cliente o email para recargar perfil');
        return null;
      }
    } catch (error) {
      console.error('Error recargando perfil:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    // 🔄 FUNCIONES EXPORTADAS
    actualizarPerfil,
    actualizarDireccion,
    cargarDatosCliente,
    recargarPerfil
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