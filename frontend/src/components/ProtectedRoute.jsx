import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige a login
 */
export default function ProtectedRoute({ children }) {
  const { estaAutenticado, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />
  }

  return children
}
