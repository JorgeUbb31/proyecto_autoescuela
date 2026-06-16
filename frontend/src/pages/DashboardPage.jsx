import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import '../styles/dashboard.css'

export default function DashboardPage() {
  const { usuario } = useAuth()

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const getRoleDisplay = () => {
    const roleMap = {
      administrador: 'Administrador',
      instructor: 'Instructor',
      profesor: 'Profesor',
      secretaria: 'Secretaria',
      usuario: 'Usuario',
    }
    return roleMap[usuario?.role] || usuario?.role
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="dashboard-main">
          <div className="dashboard-header animate-slide-up">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                {getWelcomeMessage()}, {usuario?.username}
              </h1>
              <p className="text-gray-600 text-lg">
                Eres un {getRoleDisplay()}
              </p>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Card Usuarios - Solo Administrador */}
            {usuario?.role === 'administrador' && (
              <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold text-primary mb-2">Usuarios</h2>
                <p className="text-gray-600 mb-4">Gestiona los usuarios del sistema</p>
                <Link to="/users" className="btn-primary inline-block">
                  Ir a Usuarios
                </Link>
              </div>
            )}

            {/* Card Instructores - Admin y Secretaria */}
            {(usuario?.role === 'administrador' || usuario?.role === 'secretaria') && (
              <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-primary mb-2">Instructores</h2>
                <p className="text-gray-600 mb-4">Administra los instructores</p>
                <Link to="/instructors" className="btn-primary inline-block">
                  Ir a Instructores
                </Link>
              </div>
            )}

            {/* Card Vehículos - Todos */}
            <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl font-bold text-primary mb-2">Vehículos</h2>
              <p className="text-gray-600 mb-4">Gestiona los vehículos</p>
              <Link to="/vehicles" className="btn-primary inline-block">
                Ir a Vehículos
              </Link>
            </div>

            {/* Card Licencias - Admin, Instructor y Profesor */}
            {(usuario?.role === 'administrador' || usuario?.role === 'instructor' || usuario?.role === 'profesor') && (
              <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl font-bold text-primary mb-2">Licencias</h2>
                <p className="text-gray-600 mb-4">Administra las licencias</p>
                <Link to="/licenses" className="btn-primary inline-block">
                  Ir a Licencias
                </Link>
              </div>
            )}
          </div>

          <div className="dashboard-info animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-primary mb-4">Información de Perfil</h2>
            <div className="bg-beige-100 rounded-lg p-6 border-l-4 border-primary">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre de Usuario</p>
                  <p className="font-semibold text-gray-900">{usuario?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{usuario?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RUT</p>
                  <p className="font-semibold text-gray-900">{usuario?.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rol</p>
                  <p className="font-semibold text-gray-900">{getRoleDisplay()}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
