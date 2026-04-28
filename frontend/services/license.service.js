/**
 * Servicio de Licencias
 * Maneja operaciones CRUD de licencias de conducir
 */

import api from "../config/api.config.js";

const licenseService = {
  /**
   * Obtiene todas las licencias
   */
  obtenerTodas: async () => {
    try {
      return await api.get("/licenses");
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene una licencia por ID
   * @param {number} id
   */
  obtenerPorId: async (id) => {
    try {
      return await api.get(`/licenses/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea una nueva licencia
   * @param {Object} datos - {instructorId, tipoLicencia, numeroLicencia, categoria, fechaEmision, fechaVencimiento}
   */
  crear: async (datos) => {
    try {
      return await api.post("/licenses", datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza una licencia
   * @param {number} id
   * @param {Object} datos
   */
  actualizar: async (id, datos) => {
    try {
      return await api.put(`/licenses/${id}`, datos);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Elimina una licencia
   * @param {number} id
   */
  eliminar: async (id) => {
    try {
      return await api.delete(`/licenses/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene licencias activas
   */
  obtenerActivas: async () => {
    try {
      const licencias = await api.get("/licenses");
      return licencias.filter((l) => l.activa);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene licencias inactivas
   */
  obtenerInactivas: async () => {
    try {
      const licencias = await api.get("/licenses");
      return licencias.filter((l) => !l.activa);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene licencias por tipo
   * @param {string} tipo - A, B, C, D, etc.
   */
  obtenerPorTipo: async (tipo) => {
    try {
      const licencias = await api.get("/licenses");
      return licencias.filter((l) => l.tipoLicencia === tipo);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene licencias de un instructor
   * @param {number} instructorId
   */
  obtenerDelInstructor: async (instructorId) => {
    try {
      const licencias = await api.get("/licenses");
      return licencias.filter((l) => l.instructorId === instructorId);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene licencias próximas a vencer (30 días)
   */
  obtenerProximasAVencer: async () => {
    try {
      const licencias = await api.get("/licenses");
      const ahora = new Date();
      const treintaDias = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);

      return licencias.filter((l) => {
        const fechaVenc = new Date(l.fechaVencimiento);
        return fechaVenc <= treintaDias && fechaVenc >= ahora;
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene licencias vencidas
   */
  obtenerVencidas: async () => {
    try {
      const licencias = await api.get("/licenses");
      const ahora = new Date();

      return licencias.filter((l) => {
        const fechaVenc = new Date(l.fechaVencimiento);
        return fechaVenc < ahora;
      });
    } catch (error) {
      throw error;
    }
  },
};

export default licenseService;
