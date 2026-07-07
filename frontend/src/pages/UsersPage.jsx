import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useUsers } from '../hooks/useUsers.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'
import AccessDenied from '../components/AccessDenied.jsx'
import '../styles/dashboard.css'

export default function UsersPage() {
  const { usuario } = useAuth()
  const { users, loading, error, submitLoading, fetchUsers, createUser, updateUser, deleteUser, setError } = useUsers()
  
  const [rolFilter, setRolFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [hasAccess, setHasAccess] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const roles = ['administrador', 'instructor', 'profesor', 'secretaria', 'usuario']
  const filteredUsers = rolFilter ? users.filter(u => u.role === rolFilter) : users

  useEffect(() => {
    if (usuario?.role !== 'administrador') {
      setHasAccess(false)
      return
    }
    setHasAccess(true)
    fetchUsers()
  }, [usuario])

  const handleEdit = (user) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }

  const handleUpdateUser = async (formData) => {
    try {
      await updateUser(editingUser.id, formData)
      setIsEditModalOpen(false)
      setEditingUser(null)
    } catch (err) {
      throw err
    }
  }

  const handleDelete = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteUser(userToDelete.id)
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    } catch (err) {
      setError(err.message)
      console.error('Error al eliminar:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const handleCreateUser = async (formData) => {
    try {
      await createUser(formData)
      setIsModalOpen(false)
    } catch (err) {
      throw err
    }
  }

  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'email', label: 'Email' },
    { key: 'rut', label: 'RUT' },
    { key: 'role', label: 'Rol' },
  ]

  if (!hasAccess) {
    return <AccessDenied message="Solo los administradores pueden acceder a la gestión de usuarios" />
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-header animate-slide-up">
            <h1 className="text-4xl font-bold text-primary mb-2">Gestión de Usuarios</h1>
            <p className="text-gray-600 text-lg">Administra todos los usuarios del sistema</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <p>{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                Nuevo Usuario
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <label htmlFor="rolFilter" className="text-sm font-semibold text-gray-700">
                Filtrar por rol:
              </label>
              <select
                id="rolFilter"
                value={rolFilter}
                onChange={(e) => setRolFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-800"
              >
                <option value="">Todos los roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </span>
            </div>

            <Table
              columns={columns}
              data={filteredUsers}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen} title="Crear Nuevo Usuario" onClose={() => setIsModalOpen(false)}>
        <Form
          fields={[
            { name: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'ej: juan123', required: true },
            { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'ej: juan@example.com', required: true },
            { name: 'rut', label: 'RUT', type: 'text', placeholder: 'ej: 12.345.678-9', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 6 caracteres', required: true },
          ]}
          onSubmit={handleCreateUser}
          loading={submitLoading}
          submitLabel="Crear Usuario"
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} title="Editar Usuario" onClose={() => setIsEditModalOpen(false)}>
        {editingUser && (
          <Form
            fields={[
              { name: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'ej: juan123', required: true, defaultValue: editingUser.username },
              { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'ej: juan@example.com', required: true, defaultValue: editingUser.email },
              { name: 'rut', label: 'RUT', type: 'text', placeholder: 'ej: 12.345.678-9', required: true, defaultValue: editingUser.rut },
            ]}
            onSubmit={handleUpdateUser}
            loading={submitLoading}
            submitLabel="Actualizar Usuario"
          />
        )}
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que quieres eliminar al usuario ${userToDelete?.username}?`}
        resourceName={`al usuario "${userToDelete?.username}"`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

