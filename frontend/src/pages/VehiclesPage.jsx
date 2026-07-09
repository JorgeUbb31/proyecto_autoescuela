import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useVehicles } from '../hooks/useVehicles.js'
import * as instructorService from '../services/instructorService.js'
import * as vehicleService from '../services/vehicleService.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'
import '../styles/dashboard.css'

export default function VehiclesPage() {
  const { usuario } = useAuth()
  const { vehicles, loading, error, submitLoading, fetchVehicles, createVehicle, updateVehicle, updateMaintenance, deleteVehicle, setError } = useVehicles()
  const [instructors, setInstructors] = useState([])
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [vehicleToAssign, setVehicleToAssign] = useState(null)
  const [selectedInstructorId, setSelectedInstructorId] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [maintenanceComment, setMaintenanceComment] = useState('')
  const [maintenanceLevel, setMaintenanceLevel] = useState('')
  const [maintenanceDecision, setMaintenanceDecision] = useState(false)
  const [maintenanceSubmitting, setMaintenanceSubmitting] = useState(false)
  const [vehicleFilter, setVehicleFilter] = useState('all')

  useEffect(() => {
    fetchVehicles()
  }, [usuario])

  useEffect(() => {
    async function loadInstructors() {
      if (usuario?.role !== 'administrador') return
      try {
        const token = localStorage.getItem('accessToken')
        const instructorsArray = await instructorService.fetchInstructors(token)
        setInstructors(instructorsArray)
      } catch (err) {
        console.error('Error al cargar instructores para asignación:', err)
      }
    }

    loadInstructors()
  }, [usuario])

  const openAssignModal = (vehicle) => {
    setVehicleToAssign(vehicle)
    setSelectedInstructorId(vehicle.instructores?.[0]?.id || '')
    setAssignModalOpen(true)
  }

  const handleAssignVehicle = async (event) => {
    event.preventDefault()
    if (!vehicleToAssign || !selectedInstructorId) return

    try {
      const token = localStorage.getItem('accessToken')
      await vehicleService.assignVehicleToInstructor(token, vehicleToAssign.id, selectedInstructorId)
      await fetchVehicles()
      setAssignModalOpen(false)
      setVehicleToAssign(null)
      setSelectedInstructorId('')
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

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

  const openMaintenanceModal = (vehicle) => {
    setSelectedVehicle(vehicle)
    setMaintenanceComment(vehicle.comentarioMantenimiento || '')
    setMaintenanceLevel(vehicle.nivelVencina || '')
    setMaintenanceDecision(vehicle.enMantenimiento || false)
    setMaintenanceModalOpen(true)
  }

  const handleMaintenanceSubmit = async (event) => {
    event.preventDefault()
    if (!selectedVehicle) return

    setMaintenanceSubmitting(true)
    try {
      const payload = {
        comentarioMantenimiento: maintenanceComment,
        nivelVencina: maintenanceLevel,
        requiereMantenimiento: usuario?.role === 'instructor' || usuario?.role === 'profesor' ? true : undefined,
        enMantenimiento: usuario?.role === 'secretaria' || usuario?.role === 'administrador' ? maintenanceDecision : false,
      }
      await updateMaintenance(selectedVehicle.id, payload)
      setMaintenanceModalOpen(false)
      setSelectedVehicle(null)
      setMaintenanceComment('')
      setMaintenanceLevel('')
      setMaintenanceDecision(false)
    } catch (err) {
      setError(err.message)
      console.error('Error al actualizar mantenimiento:', err)
    } finally {
      setMaintenanceSubmitting(false)
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (vehicleFilter === 'available') return vehicle.disponible
    if (vehicleFilter === 'maintenance') return vehicle.enMantenimiento
    if (vehicleFilter === 'assigned') return Array.isArray(vehicle.instructores) && vehicle.instructores.length > 0
    if (vehicleFilter === 'unassigned') return !Array.isArray(vehicle.instructores) || vehicle.instructores.length === 0
    return true
  })

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'ano', label: 'Año' },
    { key: 'transmision', label: 'Transmisión' },
    {
      key: 'instructores',
      label: 'Instructor(es)',
      render: (row) => (
        <span className="text-sm text-gray-700">
          {Array.isArray(row.instructores) && row.instructores.length > 0
            ? row.instructores.map((instructor) => instructor.nombre || instructor.rut).join(', ')
            : 'Sin asignar'}
        </span>
      ),
    },
    { 
      key: 'disponible', 
      label: 'Disponibilidad',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          row.disponible ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
        }`}>
          {row.disponible ? 'Disponible' : 'No disponible'}
        </span>
      )
    },
    {
      key: 'nivelVencina',
      label: 'Vencina',
      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.nivelVencina || 'Sin registro'}
        </span>
      )
    },
    {
      key: 'comentarioMantenimiento',
      label: 'Comentario',
      render: (row) => (
        <span className="text-sm text-gray-700" title={row.comentarioMantenimiento || ''}>
          {row.comentarioMantenimiento ? `${row.comentarioMantenimiento.slice(0, 40)}${row.comentarioMantenimiento.length > 40 ? '…' : ''}` : 'Sin comentarios'}
        </span>
      )
    },
    {
      key: 'estadoMantenimiento',
      label: 'Mantenimiento',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          row.enMantenimiento ? 'bg-red-200 text-red-800' : row.requiereMantenimiento ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-800'
        }`}>
          {row.estadoMantenimiento || 'Sin reporte'}
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
              <div className="flex-1">
                <p className="font-semibold mb-2">{error}</p>
                <button
                  onClick={fetchVehicles}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Vehículos</h2>
                <p className="text-gray-600 text-sm">Filtra por estado para ver el inventario relevante.</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                >
                  <option value="all">Ver todos</option>
                  <option value="available">Disponibles</option>
                  <option value="maintenance">En mantenimiento</option>
                  <option value="assigned">Asignados</option>
                  <option value="unassigned">Sin asignar</option>
                </select>
                <button
                  onClick={() => setVehicleFilter('all')}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            <Table
              columns={columns}
              data={filteredVehicles}
              loading={loading}
              onEdit={usuario?.role === 'administrador' ? handleEdit : null}
              onDelete={usuario?.role === 'administrador' ? handleDelete : null}
              renderActions={usuario?.role === 'administrador' ? (row) => (
                <button
                  onClick={() => openAssignModal(row)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold"
                >
                  Asignar
                </button>
              ) : null}
            />

            {(usuario?.role === 'instructor' || usuario?.role === 'profesor' || usuario?.role === 'secretaria' || usuario?.role === 'administrador') && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Acciones rápidas</h3>
                <p className="text-sm text-gray-600 mb-4">Los instructores pueden reportar mantenimiento y la secretaria puede decidir si el vehículo entra a mantenimiento.</p>
                <div className="flex flex-wrap gap-3">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => openMaintenanceModal(vehicle)}
                      className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary"
                    >
                      {vehicle.matricula}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen} title="Crear Nuevo Vehículo" onClose={() => setIsModalOpen(false)}>
        <Form
          fields={[
            { name: 'matricula', label: 'Matrícula', type: 'text', placeholder: 'ej: ABCD-1234', required: true },
            { name: 'marca', label: 'Marca', type: 'text', placeholder: 'ej: Toyota', required: true },
            { name: 'modelo', label: 'Modelo', type: 'text', placeholder: 'ej: Corolla', required: true },
            { name: 'ano', label: 'Año', type: 'number', placeholder: 'ej: 2023', required: true },
            { 
              name: 'tipo', 
              label: 'Tipo', 
              type: 'select',
              options: [
                { value: 'AUTO', label: 'Auto' },
                { value: 'CAMION', label: 'Camión' },
                { value: 'MOTO', label: 'Moto' },
              ],
              required: true,
            },
            { 
              name: 'transmision', 
              label: 'Transmisión', 
              type: 'select',
              options: [
                { value: 'MANUAL', label: 'Manual' },
                { value: 'AUTOMATICA', label: 'Automática' },
              ],
              required: true,
            },
            { name: 'vencimientoPatente', label: 'Vencimiento de Patente', type: 'date', required: true },
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
              { name: 'ano', label: 'Año', type: 'number', placeholder: 'ej: 2023', required: true, defaultValue: editingVehicle.ano },
              { 
                name: 'tipo', 
                label: 'Tipo', 
                type: 'select',
                options: [
                  { value: 'AUTO', label: 'Auto' },
                  { value: 'CAMION', label: 'Camión' },
                  { value: 'MOTO', label: 'Moto' },
                ],
                required: true,
                defaultValue: editingVehicle.tipo,
              },
              { 
                name: 'transmision', 
                label: 'Transmisión', 
                type: 'select',
                options: [
                  { value: 'MANUAL', label: 'Manual' },
                  { value: 'AUTOMATICA', label: 'Automática' },
                ],
                required: true,
                defaultValue: editingVehicle.transmision,
              },
              { name: 'vencimientoPatente', label: 'Vencimiento de Patente', type: 'date', required: true, defaultValue: editingVehicle.vencimientoPatente },
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

      <Modal isOpen={assignModalOpen} title="Asignar vehículo a instructor" onClose={() => setAssignModalOpen(false)}>
        <form onSubmit={handleAssignVehicle} className="space-y-4">
          <p className="text-sm text-gray-600">
            Vehículo: <span className="font-semibold">{vehicleToAssign?.matricula}</span>
          </p>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Seleccionar instructor</span>
            <select
              value={selectedInstructorId}
              onChange={(event) => setSelectedInstructorId(event.target.value)}
              className="input-field w-full mt-2"
              required
            >
              <option value="">Selecciona un instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.nombre || instructor.usuario?.username || instructor.rut}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setAssignModalOpen(false)} className="px-4 py-2 rounded-lg border">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Asignar vehículo
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={maintenanceModalOpen} title="Mantenimiento del vehículo" onClose={() => setMaintenanceModalOpen(false)}>
        {selectedVehicle && (
          <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Vehículo: <span className="font-semibold">{selectedVehicle.matricula}</span>
            </p>
            <textarea
              value={maintenanceComment}
              onChange={(e) => setMaintenanceComment(e.target.value)}
              rows={4}
              className="input-field w-full"
              placeholder="Describe el problema o comentario de mantenimiento"
            />
            <input
              type="text"
              value={maintenanceLevel}
              onChange={(e) => setMaintenanceLevel(e.target.value)}
              className="input-field w-full"
              placeholder="Nivel de vencina / estado del vehículo"
            />
            {(usuario?.role === 'secretaria' || usuario?.role === 'administrador') && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={maintenanceDecision}
                  onChange={(e) => setMaintenanceDecision(e.target.checked)}
                />
                Enviar a mantenimiento y quitar de servicio
              </label>
            )}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setMaintenanceModalOpen(false)} className="px-4 py-2 rounded-lg border">
                Cancelar
              </button>
              <button type="submit" disabled={maintenanceSubmitting} className="btn-primary disabled:opacity-50">
                {maintenanceSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

