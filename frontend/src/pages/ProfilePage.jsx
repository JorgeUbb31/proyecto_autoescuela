import { useMemo } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import '../styles/dashboard.css'

export default function ProfilePage() {
  const { usuario } = useAuth()

  const roleLabel = useMemo(() => {
    if (!usuario?.role) return 'Usuario'
    return usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1)
  }, [usuario?.role])

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-header animate-slide-up">
            <h1 className="text-4xl font-bold text-primary mb-2">Mi perfil</h1>
            <p className="text-gray-600 text-lg">Revisa y confirma tus datos de cuenta.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Nombre de usuario</p>
                <p className="font-semibold text-gray-900">{usuario?.username || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{usuario?.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">RUT</p>
                <p className="font-semibold text-gray-900">{usuario?.rut || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rol</p>
                <p className="font-semibold text-gray-900">{roleLabel}</p>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-beige-100 border border-primary/15">
              <h2 className="text-xl font-semibold text-primary mb-3">Información de cuenta</h2>
              <p className="text-gray-700 leading-relaxed">
                Aquí puedes ver los datos de tu perfil y confirmar que estén actualizados. Si necesitas cambiar alguno de ellos,
                contacta directamente al administrador para que realice la actualización.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
