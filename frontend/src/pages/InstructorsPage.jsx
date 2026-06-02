import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import '../styles/dashboard.css'

export default function InstructorsPage() {
  const { usuario } = useAuth()
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (usuario?.role === 'usuario') {
      setError('No tienes permisos para acceder a esta página')
      return
    }
    fetchInstructors()
  }, [usuario])

  const fetchInstructors = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/instructors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al cargar instructores')
      }

      const data = await response.json()
      // Manejar tanto respuesta de array como de objeto
      const instructorsArray = Array.isArray(data) ? data : (data?.data || [])
      setInstructors(instructorsArray)
    } catch (err) {
      setError(err.message)
      setInstructors([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (instructor) => {
    alert(`Editar instructor: ${instructor.rut}`)
  }

  const handleDelete = async (instructorId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este instructor?')) return

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/instructors/${instructorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al eliminar instructor')
      }

      setInstructors(instructors.filter((i) => i.id !== instructorId))
    } catch (err) {
      setError(err.message)
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'rut', label: 'RUT' },
    { key: 'especializacion', label: 'Especialización' },
    { key: 'anos_experiencia', label: 'Años de Experiencia' },
    { 
      key: 'activo', 
      label: 'Estado',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          row.activo ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ]

  if (error && usuario?.role === 'usuario') {
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
            <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Instructores</h1>
            <p className="text-gray-600 text-lg">Administra los instructores y profesores</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <p>{error}</p>
              <button
                onClick={fetchInstructors}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Instructores</h2>
              {usuario?.role === 'administrador' && (
                <button className="btn-primary">Nuevo Instructor</button>
              )}
            </div>

            <Table
              columns={columns}
              data={instructors}
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
