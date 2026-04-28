/**
 * Servicio de Autenticación
 * Maneja login, registro y logout
 */

import api from "../config/api.config.js";

const authService = {
  /**
   * Registra un nuevo usuario
   * @param {Object} datos - {username, rut, email, password}
   */
  registro: async (datos) => {
    try {
      const respuesta = await api.post("/auth/register", datos);
      if (respuesta.accessToken) {
        api.guardarToken(respuesta.accessToken);
      }
      return respuesta;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Inicia sesión
   * @param {Object} credenciales - {email, password}
   */
  login: async (credenciales) => {
    try {
      const respuesta = await api.post("/auth/login", credenciales);
      if (respuesta.accessToken) {
        api.guardarToken(respuesta.accessToken);
      }
      return respuesta;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cierra la sesión
   */
  logout: async () => {
    try {
      await api.post("/auth/logout", {});
      api.eliminarToken();
    } catch (error) {
      // Eliminar token aunque falle la petición
      api.eliminarToken();
      throw error;
    }
  },

  /**
   * Verifica si el usuario tiene un token válido
   */
  estaAutenticado: () => {
    return api.obtenerToken() !== null;
  },

  /**
   * Obtiene el token actual
   */
  obtenerToken: () => {
    return api.obtenerToken();
  },
};

export default authService;
