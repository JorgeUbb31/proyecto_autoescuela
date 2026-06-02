import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import '../styles/dashboard.css'

export default function LicensesPage() {
  const { usuario } = useAuth()
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (usuario?.role === 'usuario' || usuario?.role === 'secretaria') {
      setError('No tienes permisos para acceder a esta página')
      return
    }
    fetchLicenses()
  }, [usuario])

  const fetchLicenses = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/licenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al cargar licencias')
      }

      const data = await response.json()
      // Manejar tanto respuesta de array como de objeto
      const licensesArray = Array.isArray(data) ? data : (data?.data || [])
      setLicenses(licensesArray)
    } catch (err) {
      setError(err.message)
      setLicenses([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (license) => {
    alert(`Editar licencia: ${license.numero_licencia}`)
  }

  const handleDelete = async (licenseId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta licencia?')) return

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/licenses/${licenseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al eliminar licencia')
      }

      setLicenses(licenses.filter((l) => l.id !== licenseId))
    } catch (err) {
      setError(err.message)
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'numero_licencia', label: 'Número' },
    { key: 'tipo_licencia', label: 'Tipo' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'fecha_emision', label: 'Emisión' },
    { key: 'fecha_vencimiento', label: 'Vencimiento' },
    { 
      key: 'activa', 
      label: 'Estado',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          row.activa ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}>
          {row.activa ? 'Activa' : 'Vencida'}
        </span>
      )
    },
  ]

  if (error && (usuario?.role === 'usuario' || usuario?.role === 'secretaria')) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-content">
          <Sidebar />
          <main className="dashboard-main">
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-header animate-slide-up">
            <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Licencias</h1>
            <p className="text-gray-600 text-lg">Administra las licencias de conducir</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <p>{error}</p>
              <button
                onClick={fetchLicenses}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Licencias</h2>
              {usuario?.role === 'administrador' && (
                <button className="btn-primary">Nueva Licencia</button>
              )}
            </div>

            <Table
              columns={columns}
              data={licenses}
              loading={loading}
              onEdit={usuario?.role === 'administrador' ? handleEdit : null}
              onDelete={usuario?.role === 'administrador' ? handleDelete : null}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
