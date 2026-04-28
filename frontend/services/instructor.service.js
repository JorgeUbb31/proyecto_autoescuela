/**
 * Servicio de Instructores
 * Maneja operaciones CRUD de instructores
 */

import api from "../config/api.config.js";

const instructorService = {
  /**
   * Obtiene todos los instructores
   */
  obtenerTodos: async () => {
    try {
      return await api.get("/instructors");
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene un instructor por ID
   * @param {number} id
   */
  obtenerPorId: async (id) => {
    try {
      return await api.get(`/instructors/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea un nuevo instructor
   * @param {Object} datos - {userId, rut, especializacion, correo, anosExperiencia, telefono}
   */
  crear: async (datos) => {
    try {
      return await api.post("/instructors", datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza un instructor
   * @param {number} id
   * @param {Object} datos
   */
  actualizar: async (id, datos) => {
    try {
      return await api.put(`/instructors/${id}`, datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Elimina un instructor
   * @param {number} id
   */
  eliminar: async (id) => {
    try {
      return await api.delete(`/instructors/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene todas las licencias de un instructor
   * @param {number} instructorId
   */
  obtenerLicencias: async (instructorId) => {
    try {
      const instructor = await api.get(`/instructors/${instructorId}`);
      return instructor.licencias || [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene todos los vehículos asignados a un instructor
   * @param {number} instructorId
   */
  obtenerVehiculos: async (instructorId) => {
    try {
      const instructor = await api.get(`/instructors/${instructorId}`);
      return instructor.vehiculosAsignados || [];
    } catch (error) {
      throw error;
    }
  },
};

export default instructorService;
