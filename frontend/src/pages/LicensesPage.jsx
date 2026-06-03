import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'
import AccessDenied from '../components/AccessDenied.jsx'
import * as licenseService from '../services/licenseService.js'
import '../styles/dashboard.css'

export default function LicensesPage() {
  const { usuario } = useAuth()
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLicense, setEditingLicense] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [licenseToDelete, setLicenseToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Solo admin, instructor y profesor pueden acceder
    if (!usuario || (usuario.role !== 'administrador' && usuario.role !== 'instructor' && usuario.role !== 'profesor')) {
      setHasAccess(false)
      return
    }
    setHasAccess(true)
    fetchLicenses()
  }, [usuario])

  const fetchLicenses = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const licensesArray = await licenseService.fetchLicenses(token)
      setLicenses(licensesArray)
    } catch (err) {
      setError(err.message)
      setLicenses([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (license) => {
    setEditingLicense(license)
    setIsEditModalOpen(true)
  }

  const handleUpdateLicense = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await licenseService.updateLicense(token, editingLicense.id, formData)
      setIsEditModalOpen(false)
      setEditingLicense(null)
      fetchLicenses()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCreateLicense = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await licenseService.createLicense(token, formData)
      setIsModalOpen(false)
      fetchLicenses()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = (license) => {
    setLicenseToDelete(license)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!licenseToDelete) return
    
    setIsDeleting(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      await licenseService.deleteLicense(token, licenseToDelete.id)
      setLicenses(licenses.filter((l) => l.id !== licenseToDelete.id))
      setIsDeleteModalOpen(false)
      setLicenseToDelete(null)
    } catch (err) {
      setError(err.message)
      console.error('Error al eliminar:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setLicenseToDelete(null)
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
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                  Nueva Licencia
                </button>
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

      <Modal isOpen={isModalOpen} title="Crear Nueva Licencia" onClose={() => setIsModalOpen(false)}>
        <Form
          fields={[
            { name: 'instructor_id', label: 'ID del Instructor', type: 'number', placeholder: 'ej: 1', required: true },
            { name: 'numero_licencia', label: 'Número de Licencia', type: 'text', placeholder: 'ej: LIC12345678', required: true },
            { 
              name: 'tipo_licencia', 
              label: 'Tipo de Licencia', 
              type: 'select',
              options: [
                { value: 'clase_A', label: 'Clase A' },
                { value: 'clase_B', label: 'Clase B' },
                { value: 'clase_C', label: 'Clase C' },
              ],
              required: true,
            },
            { name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'ej: Conducción', required: true },
            { name: 'fecha_emision', label: 'Fecha de Emisión', type: 'date', required: true },
            { name: 'fecha_vencimiento', label: 'Fecha de Vencimiento', type: 'date', required: true },
            { 
              name: 'imagen', 
              label: 'Imagen de la Licencia', 
              type: 'file',
              accept: 'image/*',
              required: false,
            },
            { 
              name: 'activa', 
              label: 'Licencia Activa', 
              type: 'checkbox',
              defaultValue: true,
            },
          ]}
          onSubmit={handleCreateLicense}
          loading={submitLoading}
          submitLabel="Crear Licencia"
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} title="Editar Licencia" onClose={() => setIsEditModalOpen(false)}>
        {editingLicense && (
          <Form
            fields={[
              { name: 'numero_licencia', label: 'Número de Licencia', type: 'text', placeholder: 'ej: LIC12345678', required: true, defaultValue: editingLicense.numeroLicencia },
              { 
                name: 'tipo_licencia', 
                label: 'Tipo de Licencia', 
                type: 'select',
                options: [
                  { value: 'clase_A', label: 'Clase A' },
                  { value: 'clase_B', label: 'Clase B' },
                  { value: 'clase_C', label: 'Clase C' },
                ],
                required: true,
                defaultValue: editingLicense.tipoLicencia,
              },
              { name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'ej: Profesional', defaultValue: editingLicense.categoria },
              { name: 'fecha_vencimiento', label: 'Fecha de Vencimiento', type: 'date', required: true, defaultValue: editingLicense.fechaVencimiento },
              { name: 'imagen_ruta', label: 'Imagen de Licencia', type: 'file', accept: 'image/*' },
            ]}
            onSubmit={handleUpdateLicense}
            loading={submitLoading}
            submitLabel="Actualizar Licencia"
          />
        )}
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Licencia"
        message={`¿Estás seguro de que quieres eliminar la licencia ${licenseToDelete?.numeroLicencia}?`}
        resourceName={`la licencia "${licenseToDelete?.numeroLicencia}"`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

