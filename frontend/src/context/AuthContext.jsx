import { createContext, useState, useCallback, useEffect } from 'react'
import apiClient from '../helpers/api.js'

/**
 * Contexto de autenticación
 * Maneja el estado del usuario y las funciones de login/logout
 */
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Verifica si hay un token válido al montar el componente
   */
  useEffect(() => {
    const verificarToken = async () => {
      try {
        if (apiClient.tieneToken()) {
          // Hacer llamada al backend para validar el token
          try {
            const respuesta = await apiClient.get('/users/profile', true)
            // Si la respuesta es exitosa, el token es válido
            setUsuario(respuesta)
          } catch (error) {
            // Si la validación falla, limpiar token
            console.warn('Token inválido, limpiando localStorage')
            apiClient.eliminarToken()
            setUsuario(null)
          }
        }
      } catch (error) {
        console.error('Error verificando token:', error)
        apiClient.eliminarToken()
      } finally {
        setCargando(false)
      }
    }

    verificarToken()
  }, [])

  /**
   * Login del usuario
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      setCargando(true)

      const respuesta = await apiClient.post('/auth/login', { email, password }, false)

      // Guardar token
      apiClient.guardarToken(respuesta.accessToken)

      // Decodificar token para obtener datos del usuario
      const payload = JSON.parse(atob(respuesta.accessToken.split('.')[1]))
      setUsuario(payload)

      return respuesta
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }, [])

  /**
   * Registro de nuevo usuario
   */
  const registro = useCallback(async (username, email, rut, password) => {
    try {
      setError(null)
      setCargando(true)

      const respuesta = await apiClient.post(
        '/auth/register',
        { username, email, rut, password },
        false
      )

      // Si es el primer usuario, no devuelve token, así que no guardamos nada
      // El usuario tendrá que hacer login manualmente
      return respuesta
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }, [])

  /**
   * Logout del usuario
   */
  const logout = useCallback(async () => {
    try {
      setError(null)
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      apiClient.eliminarToken()
      setUsuario(null)
    }
  }, [])

  const valor = {
    usuario,
    cargando,
    error,
    estaAutenticado: !!usuario,
    login,
    registro,
    logout,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
