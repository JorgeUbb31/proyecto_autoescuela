/**
 * Configuración base del cliente HTTP
 * Maneja las peticiones al backend con autenticación JWT
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.obtenerToken();
  }

  /**
   * Obtiene el token JWT del localStorage
   */
  obtenerToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  /**
   * Guarda el token JWT en localStorage
   */
  guardarToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      this.token = token;
    }
  }

  /**
   * Elimina el token JWT del localStorage
   */
  eliminarToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      this.token = null;
    }
  }

  /**
   * Realiza una petición GET
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: this.obtenerHeaders(),
      });
      return await this.procesarRespuesta(response);
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  /**
   * Realiza una petición POST
   */
  async post(endpoint, datos) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.obtenerHeaders(),
        body: JSON.stringify(datos),
      });
      return await this.procesarRespuesta(response);
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put(endpoint, datos) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: this.obtenerHeaders(),
        body: JSON.stringify(datos),
      });
      return await this.procesarRespuesta(response);
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: this.obtenerHeaders(),
      });
      return await this.procesarRespuesta(response);
    } catch (error) {
      throw this.manejarError(error);
    }
  }

  /**
   * Obtiene los headers necesarios para las peticiones
   */
  obtenerHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Procesa la respuesta del servidor
   */
  async procesarRespuesta(response) {
    const datos = await response.json();

    if (!response.ok) {
      const error = new Error(datos.message || "Error en la petición");
      error.status = response.status;
      error.datos = datos;
      throw error;
    }

    return datos;
  }

  /**
   * Maneja los errores de la petición
   */
  manejarError(error) {
    console.error("Error en petición HTTP:", error);

    if (error.status === 401) {
      this.eliminarToken();
      // Aquí podrías redirigir a login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return error;
  }
}

export default new APIClient();
