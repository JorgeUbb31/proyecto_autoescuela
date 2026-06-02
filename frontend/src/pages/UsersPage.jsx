import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Table from '../components/Table.jsx'
import Modal from '../components/Modal.jsx'
import Form from '../components/Form.jsx'
import AccessDenied from '../components/AccessDenied.jsx'
import '../styles/dashboard.css'

export default function UsersPage() {
  const { usuario } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rolFilter, setRolFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(true)

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

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al cargar usuarios')
      }

      const data = await response.json()
      // Manejar tanto respuesta de array como de objeto
      const usersArray = Array.isArray(data) ? data : (data?.data || [])
      setUsers(usersArray)
    } catch (err) {
      setError(err.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }

  const handleUpdateUser = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar usuario')
      }

      setIsEditModalOpen(false)
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al eliminar usuario')
      }

      setUsers(users.filter((u) => u.id !== userId))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreateUser = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear usuario')
      }

      setIsModalOpen(false)
      fetchUsers()
    } catch (err) {
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
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
    </div>
  )
}

