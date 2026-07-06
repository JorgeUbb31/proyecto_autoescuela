import { createContext, useState, useCallback, useEffect } from 'react'
import apiClient from '../helpers/api.js'
import Modal from '../components/Modal.jsx'

/**
 * Contexto de autenticación
 * Maneja el estado del usuario y las funciones de login/logout
 */
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [showInstructorPromotionNotice, setShowInstructorPromotionNotice] = useState(false)

  const mostrarAvisoInstructor = useCallback((usuarioActual) => {
    if (!usuarioActual || usuarioActual.role !== 'instructor') return

    const userId = usuarioActual.id ?? usuarioActual.userId
    const storageKey = userId ? `instructorPromotionNoticeSeen:${userId}` : 'instructorPromotionNoticeSeen'

    if (localStorage.getItem(storageKey) === 'true') return

    localStorage.setItem(storageKey, 'true')
    setShowInstructorPromotionNotice(true)
  }, [])

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
            // Extraer el usuario del objeto data
            setUsuario(respuesta.data)
            mostrarAvisoInstructor(respuesta.data)
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
      mostrarAvisoInstructor(payload)

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

  return (
    <AuthContext.Provider value={valor}>
      {children}
      <Modal
        isOpen={showInstructorPromotionNotice}
        title="¡Nuevo rol asignado!"
        onClose={() => setShowInstructorPromotionNotice(false)}
      >
        <div className="space-y-3">
          <p className="text-gray-700">
            Ahora eres instructor de manejo. Puedes comenzar a gestionar tus asignaciones y licencias desde el panel.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowInstructorPromotionNotice(false)}
              className="btn-primary"
            >
              Entendido
            </button>
          </div>
        </div>
      </Modal>
    </AuthContext.Provider>
  )
}
