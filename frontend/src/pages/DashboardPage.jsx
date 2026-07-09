import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useDashboard } from '../hooks/useDashboard.js'
import * as vehicleService from '../services/vehicleService.js'
import * as licenseService from '../services/licenseService.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import '../styles/dashboard.css'

export default function DashboardPage() {
  const { usuario } = useAuth()
  const { welcomeMessage, roleDisplay } = useDashboard(usuario)
  const [fleetSummary, setFleetSummary] = useState(null)
  const [fleetLoading, setFleetLoading] = useState(false)
  const [fleetError, setFleetError] = useState('')
  const [licenseSummary, setLicenseSummary] = useState(null)
  const [licenseLoading, setLicenseLoading] = useState(false)
  const [licenseError, setLicenseError] = useState('')

  const fleetMaintenanceRate = fleetSummary?.totalVehicles
    ? fleetSummary.maintenanceVehicles / fleetSummary.totalVehicles
    : 0
  const fleetAtRisk = fleetMaintenanceRate > 0.3
  const fleetRiskLabel = fleetAtRisk ? 'Flota en riesgo' : 'Flota estable'
  const fleetRiskClass = fleetAtRisk ? 'text-red-600' : 'text-green-600'

  useEffect(() => {
    async function loadFleetSummary() {
      if (!usuario || (usuario.role !== 'administrador' && usuario.role !== 'secretaria')) {
        return
      }

      setFleetLoading(true)
      setFleetError('')
      try {
        const token = localStorage.getItem('accessToken')
        const summary = await vehicleService.fetchFleetSummary(token)
        setFleetSummary(summary)
      } catch (error) {
        setFleetError(error.message || 'Error al cargar el estado de la flota')
        setFleetSummary(null)
      } finally {
        setFleetLoading(false)
      }
    }

    loadFleetSummary()
    loadLicenseSummary()
  }, [usuario])

  async function loadLicenseSummary() {
    if (!usuario || (usuario.role !== 'administrador' && usuario.role !== 'secretaria')) {
      return
    }

    setLicenseLoading(true)
    setLicenseError('')
    try {
      const token = localStorage.getItem('accessToken')
      const summary = await licenseService.fetchLicenseSummary(token)
      setLicenseSummary(summary)
    } catch (error) {
      setLicenseError(error.message || 'Error al cargar el resumen de licencias')
      setLicenseSummary(null)
    } finally {
      setLicenseLoading(false)
    }
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
                {welcomeMessage}, {usuario?.username}
              </h1>
              <p className="text-gray-600 text-lg">
                Eres un {roleDisplay}
              </p>
            </div>
          </div>

          {(usuario?.role === 'administrador' || usuario?.role === 'secretaria') && (
            <div className="dashboard-info animate-slide-up grid gap-6 lg:grid-cols-2 mb-8" style={{ animationDelay: '0.5s' }}>
              <div className="bg-beige-100 rounded-lg p-6 border-l-4 border-primary">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Estado de la flota</h2>
                    <p className={`font-semibold ${fleetRiskClass}`}>{fleetRiskLabel}</p>
                  </div>
                  {fleetAtRisk && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                      Atención
                    </span>
                  )}
                </div>

                {fleetLoading ? (
                  <p className="text-gray-600">Cargando datos de la flota...</p>
                ) : fleetError ? (
                  <p className="text-red-600">{fleetError}</p>
                ) : fleetSummary ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-600">Total de vehículos</p>
                      <p className="font-semibold text-gray-900">{fleetSummary.totalVehicles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Disponibles</p>
                      <p className="font-semibold text-gray-900">{fleetSummary.availableVehicles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">En mantenimiento</p>
                      <p className="font-semibold text-gray-900">{fleetSummary.maintenanceVehicles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Asignados</p>
                      <p className="font-semibold text-gray-900">{fleetSummary.assignedVehicles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sin asignar</p>
                      <p className="font-semibold text-gray-900">{fleetSummary.unassignedVehicles}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No hay datos disponibles.</p>
                )}
              </div>

              <div className="bg-beige-100 rounded-lg p-6 border-l-4 border-primary">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Resumen de licencias</h2>
                    <p className="font-semibold text-gray-700">Información clave para renovaciones y cargos</p>
                  </div>
                </div>

                {licenseLoading ? (
                  <p className="text-gray-600">Cargando resumen de licencias...</p>
                ) : licenseError ? (
                  <p className="text-red-600">{licenseError}</p>
                ) : licenseSummary ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-600">Total de licencias</p>
                      <p className="font-semibold text-gray-900">{licenseSummary.totalLicenses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Activas</p>
                      <p className="font-semibold text-gray-900">{licenseSummary.activeLicenses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vencidas</p>
                      <p className="font-semibold text-gray-900">{licenseSummary.expiredLicenses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Por vencer en 30 días</p>
                      <p className="font-semibold text-gray-900">{licenseSummary.expiringSoonLicenses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recordatorios pendientes</p>
                      <p className="font-semibold text-gray-900">{licenseSummary.pendingReminders}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No hay datos disponibles.</p>
                )}
              </div>
            </div>
          )}

          <div className="dashboard-grid">
            {/* Card Usuarios - Solo Administrador */}
            {usuario?.role === 'administrador' && (
              <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-primary mb-2">Usuarios</h2>
                <p className="text-gray-600 mb-4">Gestiona los usuarios del sistema</p>
                <Link to="/users" className="btn-primary inline-block">
                  Ir a Usuarios
                </Link>
              </div>
            )}

            {/* Card Instructores - Admin y Secretaria */}
            {(usuario?.role === 'administrador' || usuario?.role === 'secretaria') && (
              <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-2xl font-bold text-primary mb-2">Instructores</h2>
                <p className="text-gray-600 mb-4">Administra los instructores</p>
                <Link to="/instructors" className="btn-primary inline-block">
                  Ir a Instructores
                </Link>
              </div>
            )}

            {/* Card Vehículos - Todos */}
            <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-bold text-primary mb-2">Vehículos</h2>
              <p className="text-gray-600 mb-4">Gestiona los vehículos</p>
              <Link to="/vehicles" className="btn-primary inline-block">
                Ir a Vehículos
              </Link>
            </div>

            {/* Card Licencias - Admin, Instructor, Profesor y Usuario */}
            {(usuario?.role === 'administrador' || usuario?.role === 'instructor' || usuario?.role === 'profesor' || usuario?.role === 'usuario') && (
              <div className="dashboard-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-2xl font-bold text-primary mb-2">Licencias</h2>
                <p className="text-gray-600 mb-4">Administra las licencias</p>
                <Link to="/licenses" className="btn-primary inline-block">
                  Ir a Licencias
                </Link>
              </div>
            )}
          </div>

          <div className="dashboard-info animate-slide-up" style={{ animationDelay: '0.6s' }}>
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
                  <p className="font-semibold text-gray-900">{roleDisplay}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
