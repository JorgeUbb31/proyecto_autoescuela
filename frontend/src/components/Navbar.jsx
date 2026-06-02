import { useAuth } from '../hooks/useAuth.js'
import '../styles/dashboard.css'

export default function Navbar() {
  const { usuario, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Autoescuela</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{usuario?.username}</p>
            <p className="text-xs opacity-80">{usuario?.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}
