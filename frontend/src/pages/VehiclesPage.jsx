import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useVehicles } from '../hooks/useVehicles.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'
import '../styles/dashboard.css'

export default function VehiclesPage() {
  const { usuario } = useAuth()
  const { vehicles, loading, error, submitLoading, fetchVehicles, createVehicle, updateVehicle, deleteVehicle, setError } = useVehicles()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [usuario])

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setIsEditModalOpen(true)
  }

  const handleUpdateVehicle = async (formData) => {
    try {
      await updateVehicle(editingVehicle.id, formData)
      setIsEditModalOpen(false)
      setEditingVehicle(null)
    } catch (err) {
      throw err
    }
  }

  const handleCreateVehicle = async (formData) => {
    try {
      await createVehicle(formData)
      setIsModalOpen(false)
    } catch (err) {
      throw err
    }
  }

  const handleDelete = (vehicle) => {
    setVehicleToDelete(vehicle)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteVehicle(vehicleToDelete.id)
      setIsDeleteModalOpen(false)
      setVehicleToDelete(null)
    } catch (err) {
      setError(err.message)
      console.error('Error al eliminar:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setVehicleToDelete(null)
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Vehículo"
        message={`¿Estás seguro de que quieres eliminar el vehículo ${vehicleToDelete?.matricula}?`}
        resourceName={`el vehículo "${vehicleToDelete?.matricula}"`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

