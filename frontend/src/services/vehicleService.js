const API_URL = import.meta.env.VITE_API_URL

export async function fetchVehicles(token) {
  const response = await fetch(`${API_URL}/vehicles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar vehículos')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data?.data || [])
}

export async function createVehicle(token, formData) {
  const response = await fetch(`${API_URL}/vehicles`, {
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

  return await response.json()
}

export async function updateVehicle(token, vehicleId, formData) {
  const response = await fetch(`${API_URL}/vehicles/${vehicleId}`, {
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

  return await response.json()
}

export async function deleteVehicle(token, vehicleId) {
  const response = await fetch(`${API_URL}/vehicles/${vehicleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al eliminar vehículo')
  }

  return await response.json()
}
