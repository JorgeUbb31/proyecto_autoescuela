import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/dashboard.css'

export default function Sidebar() {
  const { usuario } = useAuth()
  const location = useLocation()

  // Definir rutas según el rol del usuario
  const getMenuItems = () => {
    const baseMenu = [
      { path: '/dashboard', label: 'Dashboard' },
    ]

    if (usuario?.role === 'administrador') {
      return [
        ...baseMenu,
        { path: '/users', label: 'Usuarios' },
        { path: '/instructors', label: 'Instructores' },
        { path: '/vehicles', label: 'Vehículos' },
        { path: '/licenses', label: 'Licencias' },
      ]
    }

    if (usuario?.role === 'instructor' || usuario?.role === 'profesor') {
      return [
        ...baseMenu,
        { path: '/vehicles', label: 'Mis Vehículos' },
        { path: '/licenses', label: 'Mis Licencias' },
      ]
    }

    if (usuario?.role === 'usuario') {
      return [
        ...baseMenu,
        { path: '/licenses', label: 'Mis Licencias' },
      ]
    }

    if (usuario?.role === 'secretaria') {
      return [
        ...baseMenu,
        { path: '/users', label: 'Usuarios' },
        { path: '/instructors', label: 'Instructores' },
        { path: '/vehicles', label: 'Vehículos Disponibles' },
      ]
    }

    return baseMenu
  }

  const menuItems = getMenuItems()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="sidebar bg-white border-r border-gray-200 shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-primary">Menú</h2>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
