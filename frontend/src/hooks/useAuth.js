import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

/**
 * Hook para acceder al contexto de autenticación
 * Lanza un error si se usa fuera del AuthProvider
 */
export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return contexto
}
