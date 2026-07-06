const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function fetchUsers(token) {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar usuarios')
  }

  const text = await response.text()
  if (!text) {
    return []
  }

  try {
    const data = JSON.parse(text)
    return Array.isArray(data) ? data : (data?.data || [])
  } catch (error) {
    console.warn('Respuesta no JSON al cargar usuarios:', text.slice(0, 120))
    return []
  }
}

export async function createUser(token, formData) {
  const response = await fetch(`${API_URL}/auth/register`, {
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

  return await response.json()
}

export async function updateUser(token, userId, formData) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
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

  return await response.json()
}

export async function updateUserRole(token, userId, role) {
  const response = await fetch(`${API_URL}/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar el rol del usuario')
  }

  return await response.json()
}

export async function deleteUser(token, userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al eliminar usuario')
  }

  return await response.json()
}
