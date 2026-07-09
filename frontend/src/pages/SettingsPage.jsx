import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import '../styles/dashboard.css'

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-header animate-slide-up">
            <h1 className="text-4xl font-bold text-primary mb-2">Configuración</h1>
            <p className="text-gray-600 text-lg">Ajusta las preferencias de tu cuenta y notificaciones.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-6">
              <section className="p-5 rounded-2xl bg-beige-100 border border-primary/15">
                <h2 className="text-2xl font-semibold text-primary mb-3">Preferencias</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
                    <span>
                      <strong className="block text-gray-900">Notificaciones por email</strong>
                      <span className="text-sm text-gray-600">Recibe alertas importantes y recordatorios.</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={() => setNotificationsEnabled((prev) => !prev)}
                    />
                  </label>
                </div>
              </section>

              <section className="p-5 rounded-2xl bg-beige-100 border border-primary/15">
                <h2 className="text-2xl font-semibold text-primary mb-3">Seguridad</h2>
                <p className="text-gray-700 leading-relaxed">
                  Estas opciones son configuraciones generales de cuenta. Si necesitas cambiar tu contraseña u otros datos,
                  contacta directamente al administrador para que realice el ajuste.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
