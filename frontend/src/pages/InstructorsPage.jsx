import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'
import AccessDenied from '../components/AccessDenied.jsx'
import * as instructorService from '../services/instructorService.js'
import * as userService from '../services/userService.js'
import '../styles/dashboard.css'

export default function InstructorsPage() {
  const { usuario } = useAuth()
  const [instructors, setInstructors] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [instructorToDelete, setInstructorToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Solo admin y secretaria pueden acceder
    if (!usuario || (usuario.role !== 'administrador' && usuario.role !== 'secretaria')) {
      setHasAccess(false)
      return
    }
    setHasAccess(true)
    fetchInstructors()
    fetchUsers()
  }, [usuario])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const usersArray = await userService.fetchUsers(token)
      setUsers(usersArray)
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
    }
  }

  const fetchInstructors = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const instructorsArray = await instructorService.fetchInstructors(token)
      setInstructors(instructorsArray)
    } catch (err) {
      setError(err.message)
      setInstructors([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor)
    setIsEditModalOpen(true)
  }

  const handleUpdateInstructor = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await instructorService.updateInstructor(token, editingInstructor.id, formData)
      setIsEditModalOpen(false)
      setEditingInstructor(null)
      fetchInstructors()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCreateInstructor = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await instructorService.createInstructor(token, formData)
      setIsModalOpen(false)
      fetchInstructors()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = (instructor) => {
    setInstructorToDelete(instructor)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return
    
    setIsDeleting(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      await instructorService.deleteInstructor(token, instructorToDelete.id)
      setInstructors(instructors.filter((i) => i.id !== instructorToDelete.id))
      setIsDeleteModalOpen(false)
      setInstructorToDelete(null)
    } catch (err) {
      setError(err.message)
      console.error('Error al eliminar:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setInstructorToDelete(null)
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'rut', label: 'RUT' },
    { key: 'especializacion', label: 'Especialización' },
    { key: 'anosExperiencia', label: 'Años de Experiencia' },
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

  if (!hasAccess) {
    return <AccessDenied message="Solo administradores y secretarias pueden acceder a la gestión de instructores" />
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
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                  Nuevo Instructor
                </button>
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

      <Modal isOpen={isModalOpen} title="Crear Nuevo Instructor" onClose={() => setIsModalOpen(false)}>
        <Form
          fields={[
            { 
              name: 'userId', 
              label: 'Seleccionar Usuario', 
              type: 'select',
              options: users.map(u => ({ value: u.id, label: `${u.username} (${u.rut})` })),
              required: true 
            },
            { name: 'rut', label: 'RUT', type: 'text', placeholder: 'ej: 12.345.678-9', required: true },
            { name: 'especializacion', label: 'Especialización', type: 'text', placeholder: 'ej: Conducción de Autos', required: true },
            { name: 'anosExperiencia', label: 'Años de Experiencia', type: 'number', placeholder: 'ej: 5', required: true },
            { 
              name: 'activo', 
              label: 'Estado Activo', 
              type: 'checkbox',
              defaultValue: true,
            },
          ]}
          onSubmit={handleCreateInstructor}
          loading={submitLoading}
          submitLabel="Crear Instructor"
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} title="Editar Instructor" onClose={() => setIsEditModalOpen(false)}>
        {editingInstructor && (
          <Form
            fields={[
              { name: 'rut', label: 'RUT', type: 'text', placeholder: 'ej: 12.345.678-9', required: true, defaultValue: editingInstructor.rut },
              { name: 'especializacion', label: 'Especialización', type: 'text', placeholder: 'ej: Conducción de Autos', required: true, defaultValue: editingInstructor.especializacion },
              { name: 'anosExperiencia', label: 'Años de Experiencia', type: 'number', placeholder: 'ej: 5', required: true, defaultValue: editingInstructor.anosExperiencia },
              { 
                name: 'activo', 
                label: 'Estado Activo', 
                type: 'checkbox',
                defaultValue: editingInstructor.activo,
              },
            ]}
            onSubmit={handleUpdateInstructor}
            loading={submitLoading}
            submitLabel="Actualizar Instructor"
          />
        )}
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Instructor"
        message={`¿Estás seguro de que quieres eliminar al instructor ${instructorToDelete?.rut}?`}
        resourceName={`al instructor "${instructorToDelete?.rut}"`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

