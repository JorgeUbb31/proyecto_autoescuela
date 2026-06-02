import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import '../styles/dashboard.css'

export default function VehiclesPage() {
  const { usuario } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [usuario])

  const fetchVehicles = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al cargar vehículos')
      }

      const data = await response.json()
      // Manejar tanto respuesta de array como de objeto
      const vehiclesArray = Array.isArray(data) ? data : (data?.data || [])
      setVehicles(vehiclesArray)
    } catch (err) {
      setError(err.message)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setIsEditModalOpen(true)
  }

  const handleUpdateVehicle = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar vehículo')
      }

      setIsEditModalOpen(false)
      setEditingVehicle(null)
      fetchVehicles()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCreateVehicle = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear vehículo')
      }

      setIsModalOpen(false)
      fetchVehicles()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (vehicleId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) return

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al eliminar vehículo')
      }

      setVehicles(vehicles.filter((v) => v.id !== vehicleId))
    } catch (err) {
      setError(err.message)
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'ano', label: 'Año' },
    { key: 'transmision', label: 'Transmisión' },
    { 
      key: 'disponible', 
      label: 'Disponibilidad',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          row.disponible ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
        }`}>
          {row.disponible ? 'Disponible' : 'En Uso'}
        </span>
      )
    },
  ]

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-header animate-slide-up">
            <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Vehículos</h1>
            <p className="text-gray-600 text-lg">Administra el inventario de vehículos</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <p>{error}</p>
              <button
                onClick={fetchVehicles}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Vehículos</h2>
              {usuario?.role === 'administrador' && (
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                  Nuevo Vehículo
                </button>
              )}
            </div>

            <Table
              columns={columns}
              data={vehicles}
              loading={loading}
              onEdit={usuario?.role === 'administrador' ? handleEdit : null}
              onDelete={usuario?.role === 'administrador' ? handleDelete : null}
            />
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen} title="Crear Nuevo Vehículo" onClose={() => setIsModalOpen(false)}>
        <Form
          fields={[
            { name: 'matricula', label: 'Matrícula', type: 'text', placeholder: 'ej: ABCD-1234', required: true },
            { name: 'marca', label: 'Marca', type: 'text', placeholder: 'ej: Toyota', required: true },
            { name: 'modelo', label: 'Modelo', type: 'text', placeholder: 'ej: Corolla', required: true },
            { name: 'año', label: 'Año', type: 'number', placeholder: 'ej: 2023', required: true },
            { 
              name: 'tipo', 
              label: 'Tipo', 
              type: 'select',
              options: [
                { value: 'auto', label: 'Auto' },
                { value: 'camion', label: 'Camión' },
                { value: 'moto', label: 'Moto' },
              ],
              required: true,
            },
            { 
              name: 'transmision', 
              label: 'Transmisión', 
              type: 'select',
              options: [
                { value: 'manual', label: 'Manual' },
                { value: 'automatica', label: 'Automática' },
              ],
              required: true,
            },
            { name: 'vencimiento_patente', label: 'Vencimiento de Patente', type: 'date', required: true },
            { 
              name: 'disponible', 
              label: 'Disponible', 
              type: 'checkbox',
              defaultValue: true,
            },
          ]}
          onSubmit={handleCreateVehicle}
          loading={submitLoading}
          submitLabel="Crear Vehículo"
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} title="Editar Vehículo" onClose={() => setIsEditModalOpen(false)}>
        {editingVehicle && (
          <Form
            fields={[
              { name: 'matricula', label: 'Matrícula', type: 'text', placeholder: 'ej: ABCD-1234', required: true, defaultValue: editingVehicle.matricula },
              { name: 'marca', label: 'Marca', type: 'text', placeholder: 'ej: Toyota', required: true, defaultValue: editingVehicle.marca },
              { name: 'modelo', label: 'Modelo', type: 'text', placeholder: 'ej: Corolla', required: true, defaultValue: editingVehicle.modelo },
              { name: 'año', label: 'Año', type: 'number', placeholder: 'ej: 2023', required: true, defaultValue: editingVehicle.año },
              { 
                name: 'tipo', 
                label: 'Tipo', 
                type: 'select',
                options: [
                  { value: 'auto', label: 'Auto' },
                  { value: 'camion', label: 'Camión' },
                  { value: 'moto', label: 'Moto' },
                ],
                required: true,
                defaultValue: editingVehicle.tipo,
              },
              { 
                name: 'transmision', 
                label: 'Transmisión', 
                type: 'select',
                options: [
                  { value: 'manual', label: 'Manual' },
                  { value: 'automatica', label: 'Automática' },
                ],
                required: true,
                defaultValue: editingVehicle.transmision,
              },
              { name: 'vencimiento_patente', label: 'Vencimiento de Patente', type: 'date', required: true, defaultValue: editingVehicle.vencimientoPatente },
              { 
                name: 'disponible', 
                label: 'Disponible', 
                type: 'checkbox',
                defaultValue: editingVehicle.disponible,
              },
            ]}
            onSubmit={handleUpdateVehicle}
            loading={submitLoading}
            submitLabel="Actualizar Vehículo"
          />
        )}
      </Modal>
    </div>
  )
}

