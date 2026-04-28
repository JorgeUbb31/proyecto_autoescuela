/**
 * Servicio de Vehículos
 * Maneja operaciones CRUD de vehículos y asignación a instructores
 */

import api from "../config/api.config.js";

const vehicleService = {
  /**
   * Obtiene todos los vehículos
   */
  obtenerTodos: async () => {
    try {
      return await api.get("/vehicles");
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene un vehículo por ID
   * @param {number} id
   */
  obtenerPorId: async (id) => {
    try {
      return await api.get(`/vehicles/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea un nuevo vehículo
   * @param {Object} datos - {matricula, marca, modelo, ano, tipo, transmision, vencimientos, disponible}
   */
  crear: async (datos) => {
    try {
      return await api.post("/vehicles", datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza un vehículo
   * @param {number} id
   * @param {Object} datos
   */
  actualizar: async (id, datos) => {
    try {
      return await api.put(`/vehicles/${id}`, datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Elimina un vehículo
   * @param {number} id
   */
  eliminar: async (id) => {
    try {
      return await api.delete(`/vehicles/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Asigna un vehículo a un instructor
   * @param {number} instructorId
   * @param {number} vehicleId
   */
  asignarAlInstructor: async (instructorId, vehicleId) => {
    try {
      return await api.post("/vehicles/assign", {
        instructorId,
        vehicleId,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Desasigna un vehículo de un instructor
   * @param {number} instructorId
   * @param {number} vehicleId
   */
  desasignarDelInstructor: async (instructorId, vehicleId) => {
    try {
      return await api.post("/vehicles/unassign", {
        instructorId,
        vehicleId,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene vehículos disponibles
   */
  obtenerDisponibles: async () => {
    try {
      const vehiculos = await api.get("/vehicles");
      return vehiculos.filter((v) => v.disponible);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene vehículos no disponibles
   */
  obtenerNoDisponibles: async () => {
    try {
      const vehiculos = await api.get("/vehicles");
      return vehiculos.filter((v) => !v.disponible);
    } catch (error) {
      throw error;
    }
  },
};

export default vehicleService;
