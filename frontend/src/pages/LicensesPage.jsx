import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useLicenses } from '../hooks/useLicenses.js'
import { API_URL } from '../config/app.config.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'
import AccessDenied from '../components/AccessDenied.jsx'
import '../styles/dashboard.css'

export default function LicensesPage() {
  const { usuario } = useAuth()
  const { licenses, loading, error, submitLoading, fetchLicenses, createLicense, updateLicense, deleteLicense, setError } = useLicenses()
  const API_BASE_URL = API_URL.replace(/\/api$/, '')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLicense, setEditingLicense] = useState(null)
  const [hasAccess, setHasAccess] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [licenseToDelete, setLicenseToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [licenseImage, setLicenseImage] = useState(null)
  const [editLicenseImage, setEditLicenseImage] = useState(null)
  const [licenseImagePreview, setLicenseImagePreview] = useState(null)
  const [editLicenseImagePreview, setEditLicenseImagePreview] = useState(null)
  const [licenseFilter, setLicenseFilter] = useState('all')

  useEffect(() => {
    // Admin, instructor, profesor y usuario pueden acceder para gestionar o enviar su licencia
    if (!usuario || (usuario.role !== 'administrador' && usuario.role !== 'instructor' && usuario.role !== 'profesor' && usuario.role !== 'usuario')) {
      setHasAccess(false)
      return
    }
    setHasAccess(true)
    fetchLicenses()
  }, [usuario])

  const getLicenseImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    if (imagePath.startsWith('/')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/licenses/${imagePath}`
  }

  const handleEdit = (license) => {
    setEditingLicense(license)
    setEditLicenseImagePreview(getLicenseImageUrl(license?.imagenRuta))
    setIsEditModalOpen(true)
  }

  const handleUpdateLicense = async (formData) => {
    try {
      if (editLicenseImage) {
        formData.imagenRuta = editLicenseImage
      }
      await updateLicense(editingLicense.id, formData)
      setIsEditModalOpen(false)
      setEditingLicense(null)
      setEditLicenseImage(null)
      setEditLicenseImagePreview(null)
    } catch (err) {
      throw err
    }
  }

  const handleCreateLicense = async (formData) => {
    try {
      if (licenseImage) {
        formData.imagenRuta = licenseImage
      }
      await createLicense(formData)
      setIsModalOpen(false)
      setLicenseImage(null)
      setLicenseImagePreview(null)
    } catch (err) {
      throw err
    }
  }

  const handleImageUpload = (event, isEdit = false) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5242880) {
      setError('La imagen no puede exceder 5MB')
      return
    }

    const previewUrl = URL.createObjectURL(file)

    if (isEdit) {
      setEditLicenseImage(file)
      setEditLicenseImagePreview(previewUrl)
    } else {
      setLicenseImage(file)
      setLicenseImagePreview(previewUrl)
    }
  }

  const handleDelete = (licenseOrId) => {
    const license = typeof licenseOrId === 'object' && licenseOrId !== null
      ? licenseOrId
      : { id: licenseOrId }

    setLicenseToDelete(license)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!licenseToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteLicense(licenseToDelete.id)
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

  const getDaysToExpiration = (fechaVencimiento) => {
    if (!fechaVencimiento) return null
    const today = new Date()
    const expiration = new Date(fechaVencimiento)
    const diffTime = expiration.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const expiringLicenses = licenses.filter((license) => {
    const days = getDaysToExpiration(license.fechaVencimiento)
    return days !== null && days > 0 && days <= 30
  })

  const licenseAlertMessage = expiringLicenses.length
    ? `Tienes ${expiringLicenses.length} licencia${expiringLicenses.length === 1 ? '' : 's'} con vencimiento en los próximos 30 días.`
    : ''

  const licenseWarnings = expiringLicenses.map((license) => {
    const days = getDaysToExpiration(license.fechaVencimiento)
    return {
      id: license.id,
      label: `Licencia ${license.numeroLicencia} vence en ${days} día${days === 1 ? '' : 's'} (${license.fechaVencimiento})`,
    }
  })

  const filteredLicenses = licenses.filter((license) => {
    if (licenseFilter === 'active') return license.activa
    if (licenseFilter === 'expired') return !license.activa
    if (licenseFilter === 'expiring') {
      const days = getDaysToExpiration(license.fechaVencimiento)
      return days !== null && days > 0 && days <= 30
    }
    return true
  })

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'numero_licencia', label: 'Número' },
    { key: 'tipo_licencia', label: 'Tipo' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'fecha_emision', label: 'Emisión' },
    { key: 'fecha_vencimiento', label: 'Vencimiento' },
    {
      key: 'imagen_ruta',
      label: 'Imagen',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.imagenRuta ? (
            <div className="flex items-center gap-2">
              <img
                src={getLicenseImageUrl(row.imagenRuta)}
                alt="Licencia"
                className="w-10 h-10 rounded-lg object-cover border border-gray-300"
                title="Vista previa de la licencia"
              />
              <span className="text-xs text-gray-600">Disponible</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Sin imagen</span>
          )}
        </div>
      )
    },
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

          {(usuario?.role === 'instructor' || usuario?.role === 'profesor') && expiringLicenses.length > 0 && (
            <div className="alert alert-warning mb-6">
              <p className="font-semibold">{licenseAlertMessage}</p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                {licenseWarnings.map((warning) => (
                  <li key={warning.id}>{warning.label}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Licencias</h2>
                <p className="text-gray-600 text-sm">Filtra por estado para ver solo las licencias relevantes.</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={licenseFilter}
                  onChange={(e) => setLicenseFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                >
                  <option value="all">Ver todas</option>
                  <option value="active">Activas</option>
                  <option value="expired">Vencidas</option>
                  <option value="expiring">Por vencer en 30 días</option>
                </select>
                <button
                  onClick={() => setLicenseFilter('all')}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            <Table
              columns={columns}
              data={filteredLicenses}
              loading={loading}
              onEdit={usuario?.role === 'administrador' ? handleEdit : null}
              onDelete={usuario?.role === 'administrador' ? handleDelete : null}
            />
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen} title="Crear Nueva Licencia" onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6">
          <Form
            fields={[
              { name: 'numeroLicencia', label: 'Número de Licencia', type: 'text', placeholder: 'ej: LIC12345678', required: true },
              { 
                name: 'tipoLicencia', 
                label: 'Tipo de Licencia', 
                type: 'select',
                options: [
                  { value: 'A', label: 'A' },
                  { value: 'B', label: 'B' },
                  { value: 'C', label: 'C' },
                ],
                required: true,
              },
              { name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'ej: Conducción', required: true },
              { name: 'fechaEmision', label: 'Fecha de Emisión', type: 'date', required: true },
              { name: 'fechaVencimiento', label: 'Fecha de Vencimiento', type: 'date', required: true },
              { 
                name: 'activa', 
                label: 'Enviar como licencia aprobada', 
                type: 'checkbox',
                defaultValue: false,
              },
            ]}
            onSubmit={handleCreateLicense}
            loading={submitLoading}
            submitLabel="Crear Licencia"
          >
            <div className="pt-4 border-t">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Imagen de la Licencia</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="licenseImage"
                  onChange={(e) => handleImageUpload(e, false)}
                />
                <label htmlFor="licenseImage" className="cursor-pointer">
                  <p className="text-gray-600">📷 Sube la foto de tu licencia</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG o GIF (máx. 5MB)</p>
                </label>
                {licenseImagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img src={licenseImagePreview} alt="Vista previa de la licencia" className="h-40 rounded-lg object-cover border border-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </Form>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} title="Editar Licencia" onClose={() => setIsEditModalOpen(false)}>
        {editingLicense && (
          <div className="space-y-6">
            <Form
              fields={[
                { name: 'numeroLicencia', label: 'Número de Licencia', type: 'text', placeholder: 'ej: LIC12345678', required: true, defaultValue: editingLicense.numeroLicencia },
                { 
                  name: 'tipoLicencia', 
                  label: 'Tipo de Licencia', 
                  type: 'select',
                  options: [
                    { value: 'A', label: 'A' },
                    { value: 'B', label: 'B' },
                    { value: 'C', label: 'C' },
                  ],
                  required: true,
                  defaultValue: editingLicense.tipoLicencia,
                },
                { name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'ej: Profesional', defaultValue: editingLicense.categoria },
                { name: 'fechaVencimiento', label: 'Fecha de Vencimiento', type: 'date', required: true, defaultValue: editingLicense.fechaVencimiento },
              ]}
              onSubmit={handleUpdateLicense}
              loading={submitLoading}
              submitLabel="Actualizar Licencia"
            >
              <div className="pt-4 border-t">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Imagen de la Licencia</label>
                {editingLicense.imagenRuta && !editLicenseImagePreview && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Imagen actual:</p>
                    <img
                      src={getLicenseImageUrl(editingLicense.imagenRuta)}
                      alt="Licencia actual"
                      className="w-full h-auto rounded-lg border border-gray-300 max-h-48 object-cover"
                    />
                  </div>
                )}
                {editLicenseImagePreview && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Nueva imagen:</p>
                    <img src={editLicenseImagePreview} alt="Nueva licencia" className="w-full h-auto rounded-lg border border-gray-300 max-h-48 object-cover" />
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="licenseImageEdit"
                    onChange={(e) => handleImageUpload(e, true)}
                  />
                  <label htmlFor="licenseImageEdit" className="cursor-pointer">
                    <p className="text-gray-600">📷 Reemplaza la foto de la licencia</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG o GIF (máx. 5MB)</p>
                  </label>
                </div>
              </div>
            </Form>
          </div>
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

