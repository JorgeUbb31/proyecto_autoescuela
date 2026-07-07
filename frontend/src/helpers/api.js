/**
 * Cliente HTTP para comunicación con el servidor
 * Usa Axios con interceptores para JWT, manejo de errores y tokens
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
   * Interceptor de petición: Agregar token a headers
   */
  inicializarInterceptores() {
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.obtenerToken()
        if (token && config.url !== '/auth/login' && config.url !== '/auth/register') {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Interceptor de respuesta: Manejar errores y tokens expirados
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Token expirado o no autorizado
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.eliminarToken()
          window.location.href = '/login'
          return Promise.reject(new Error('Sesión expirada. Por favor inicia sesión nuevamente.'))
        }

        // Errores del servidor o cliente
        const mensaje = error.response?.data?.message || error.message || 'Error en la solicitud'
        return Promise.reject(new Error(mensaje))
      }
    )
  }

  /**
   * Realiza una petición GET
   */
  async get(url) {
    try {
      const response = await axiosInstance.get(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Realiza una petición POST
   */
  async post(url, datos = {}) {
    try {
      const response = await axiosInstance.post(url, datos)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put(url, datos = {}) {
    try {
      const response = await axiosInstance.put(url, datos)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete(url) {
    try {
      const response = await axiosInstance.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Sube un archivo (FormData)
   */
  async uploadFile(url, formData) {
    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Crear instancia y inicializar interceptores
const apiClient = new APIClient()
apiClient.inicializarInterceptores()

export default apiClient

