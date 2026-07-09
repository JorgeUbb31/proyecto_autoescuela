import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useInstructors } from '../hooks/useInstructors.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import AccessDenied from '../components/AccessDenied.jsx'
import * as licenseService from '../services/licenseService.js'
import '../styles/dashboard.css'

export default function InstructorsPage() {
  const { usuario } = useAuth()
  const { instructors, users, licenses, loading, error, submitLoading, loadData, createProfessor, createInstructor, updateInstructor, deleteInstructor, setError } = useInstructors()
  
  const eligibleUsers = users.filter((user) => ['profesor', 'instructor'].includes(user.role))
  const professors = (users || []).filter((user) => user.role === 'profesor')
  const professorLicenses = (licenses || []).filter((license) => license.activa)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState(null)
  const [hasAccess, setHasAccess] = useState(true)

  useEffect(() => {
    // Solo admin y secretaria pueden acceder
    if (!usuario || (usuario.role !== 'administrador' && usuario.role !== 'secretaria')) {
      setHasAccess(false)
      return
    }
    setHasAccess(true)
    loadData()
  }, [usuario])

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor)
    setIsEditModalOpen(true)
  }

  const handleUpdateInstructor = async (formData) => {
    try {
      await updateInstructor(editingInstructor.id, formData)
      setIsEditModalOpen(false)
      setEditingInstructor(null)
    } catch (err) {
      throw err
    }
  }

  const handleCreateInstructor = async (formData) => {
    try {
      await createInstructor(formData)
      setIsModalOpen(false)
    } catch (err) {
      throw err
    }
  }

  const handlePromoteProfessor = async (professor) => {
    const confirmed = window.confirm(`¿Deseas promover a ${professor.username} a instructor?`)
    if (!confirmed) return

    try {
      await createInstructor({
        userId: professor.id,
        rut: professor.rut,
        especializacion: 'Profesor promovido',
        anosExperiencia: 0,
        activo: true,
      })
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleLicenseStatus = async (license, active) => {
    try {
      const token = localStorage.getItem('accessToken')
      await licenseService.updateLicense(token, license.id, { activa: active })
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreateProfessor = async (formData) => {
    try {
      await createProfessor(formData)
      setIsProfessorModalOpen(false)
    } catch (err) {
      throw err
    }
  }


  const professorColumns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Nombre de usuario' },
    { key: 'email', label: 'Correo' },
    { key: 'rut', label: 'RUT' },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => {
        const hasActiveLicense = (licenses || []).some((license) => license.instructorId === row.id || license.instructor?.id === row.id || (license.activa && license.instructor?.rut === row.rut))
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            hasActiveLicense ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
          }`}>
            {hasActiveLicense ? 'Licencia verificada' : 'Sin licencia'}
          </span>
        )
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handlePromoteProfessor(row)}
            className="px-3 py-1 bg-secondary text-white rounded hover:bg-primary transition-colors duration-200 text-sm font-semibold"
          >
            Promover a instructor
          </button>
        </div>
      ),
    },
  ]

  const instructorColumns = [
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
            <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Profesores e Instructores</h1>
            <p className="text-gray-600 text-lg">Separa la parte teórica de la práctica del manejo</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <p>{error}</p>
              <button
                onClick={loadData}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profesores</h2>
                {usuario?.role === 'administrador' && (
                  <button onClick={() => setIsProfessorModalOpen(true)} className="btn-primary">
                    Nuevo Profesor
                  </button>
                )}
              </div>

              <Table
                columns={professorColumns}
                data={professors}
                loading={loading}
              />

              {professorLicenses.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Licencias presentadas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left">Número</th>
                          <th className="px-3 py-2 text-left">Tipo</th>
                          <th className="px-3 py-2 text-left">Categoría</th>
                          <th className="px-3 py-2 text-left">Vencimiento</th>
                          <th className="px-3 py-2 text-left">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {professorLicenses.map((license) => (
                          <tr key={license.id} className="border-b">
                            <td className="px-3 py-2">{license.numeroLicencia}</td>
                            <td className="px-3 py-2">{license.tipoLicencia}</td>
                            <td className="px-3 py-2">{license.categoria}</td>
                            <td className="px-3 py-2">{license.fechaVencimiento}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${license.activa ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                  {license.activa ? 'Activa' : 'Inactiva'}
                                </span>
                                {usuario?.role === 'administrador' && (
                                  <button
                                    onClick={() => handleToggleLicenseStatus(license, !license.activa)}
                                    className={`px-2 py-1 rounded text-xs font-semibold ${license.activa ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                  >
                                    {license.activa ? 'Rechazar' : 'Aprobar'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Instructores</h2>
                {usuario?.role === 'administrador' && (
                  <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    Nuevo Instructor
                  </button>
                )}
              </div>

              <Table
                columns={instructorColumns}
                data={instructors}
                loading={loading}
                onEdit={usuario?.role === 'administrador' ? handleEdit : null}
              />
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={isProfessorModalOpen} title="Registrar Profesor con Licencia" onClose={() => setIsProfessorModalOpen(false)}>
        <Form
          fields={[
            {
              name: 'userId',
              label: 'Seleccionar usuario',
              type: 'select',
              options: users.filter((user) => user.role === 'usuario').map((user) => ({ value: user.id, label: `${user.username} (${user.rut})` })),
              placeholder: 'Selecciona un usuario',
              required: true,
            },
            { name: 'numeroLicencia', label: 'Número de licencia', type: 'text', placeholder: 'ej: LIC-12345', required: true },
            { name: 'tipoLicencia', label: 'Tipo de licencia', type: 'text', placeholder: 'ej: B', required: true },
            { name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'ej: Automóvil', required: true },
            { name: 'fechaEmision', label: 'Fecha de emisión', type: 'date', required: true },
            { name: 'fechaVencimiento', label: 'Fecha de vencimiento', type: 'date', required: true },
            { name: 'activa', label: 'Licencia activa', type: 'checkbox', defaultValue: true },
          ]}
          onSubmit={handleCreateProfessor}
          loading={submitLoading}
          submitLabel="Crear Profesor"
        />
      </Modal>

      <Modal isOpen={isModalOpen} title="Crear Nuevo Instructor" onClose={() => setIsModalOpen(false)}>
        <Form
          fields={[
            { 
              name: 'userId', 
              label: 'Seleccionar Profesor', 
              type: 'select',
              options: eligibleUsers.map((user) => ({ value: user.id, label: `${user.username} (${user.rut})` })),
              placeholder: 'Selecciona un profesor registrado',
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

    </div>
  )
}

