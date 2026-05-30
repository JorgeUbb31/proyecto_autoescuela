/**
 * Cliente HTTP para comunicación con el servidor
 * Maneja tokens JWT y errores comunes
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class APIClient {
  /**
   * Obtiene el token JWT del localStorage
   */
  obtenerToken() {
    return localStorage.getItem('accessToken')
  }

  /**
   * Guarda el token JWT en localStorage
   */
  guardarToken(token) {
    localStorage.setItem('accessToken', token)
  }

  /**
   * Elimina el token JWT del localStorage
   */
  eliminarToken() {
    localStorage.removeItem('accessToken')
  }

  /**
   * Verifica si hay un token válido
   */
  tieneToken() {
    return !!this.obtenerToken()
  }

  /**
   * Construye los headers comunes para las peticiones
   */
  construirHeaders(incluirToken = true) {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (incluirToken) {
      const token = this.obtenerToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Realiza una petición GET
   */
  async get(url, incluirToken = true) {
    try {
      const respuesta = await fetch(`${API_URL}${url}`, {
        method: 'GET',
        headers: this.construirHeaders(incluirToken),
      })

      return this.procesarRespuesta(respuesta)
    } catch (error) {
      throw new Error(`Error en GET ${url}: ${error.message}`)
    }
  }

  /**
   * Realiza una petición POST
   */
  async post(url, datos = {}, incluirToken = true) {
    try {
      const respuesta = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: this.construirHeaders(incluirToken),
        body: JSON.stringify(datos),
      })

      return this.procesarRespuesta(respuesta)
    } catch (error) {
      throw new Error(`Error en POST ${url}: ${error.message}`)
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put(url, datos = {}, incluirToken = true) {
    try {
      const respuesta = await fetch(`${API_URL}${url}`, {
        method: 'PUT',
        headers: this.construirHeaders(incluirToken),
        body: JSON.stringify(datos),
      })

      return this.procesarRespuesta(respuesta)
    } catch (error) {
      throw new Error(`Error en PUT ${url}: ${error.message}`)
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete(url, incluirToken = true) {
    try {
      const respuesta = await fetch(`${API_URL}${url}`, {
        method: 'DELETE',
        headers: this.construirHeaders(incluirToken),
      })

      return this.procesarRespuesta(respuesta)
    } catch (error) {
      throw new Error(`Error en DELETE ${url}: ${error.message}`)
    }
  }

  /**
   * Procesa la respuesta del servidor
   * Lanza errores para códigos 4xx y 5xx
   */
  async procesarRespuesta(respuesta) {
    const datos = await respuesta.json()

    // Token expirado o inválido
    if (respuesta.status === 401 || respuesta.status === 403) {
      this.eliminarToken()
      window.location.href = '/login'
      throw new Error(datos.message || 'No autorizado')
    }

    // Error del servidor o cliente
    if (!respuesta.ok) {
      throw new Error(datos.message || `Error ${respuesta.status}`)
    }

    return datos
  }
}

export default new APIClient()
