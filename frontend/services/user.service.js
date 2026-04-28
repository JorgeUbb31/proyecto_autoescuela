/**
 * Servicio de Usuarios
 * Maneja operaciones CRUD de usuarios
 */

import api from "../config/api.config.js";

const userService = {
  /**
   * Obtiene todos los usuarios
   */
  obtenerTodos: async () => {
    try {
      return await api.get("/users");
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene un usuario por ID
   * @param {number} id
   */
  obtenerPorId: async (id) => {
    try {
      return await api.get(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} datos
   */
  crear: async (datos) => {
    try {
      return await api.post("/users", datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza un usuario
   * @param {number} id
   * @param {Object} datos
   */
  actualizar: async (id, datos) => {
    try {
      return await api.put(`/users/${id}`, datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Elimina un usuario
   * @param {number} id
   */
  eliminar: async (id) => {
    try {
      return await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
