import { API_URL } from '../config/app.config.js';

export async function fetchInstructors(token) {
  const response = await fetch(`${API_URL}/instructors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar instructores')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data?.data || [])
}

export async function createInstructor(token, formData) {
  const payload = {
    ...formData,
    userId: parseInt(formData.userId),
    anosExperiencia: parseInt(formData.anosExperiencia),
  }
  
  const response = await fetch(`${API_URL}/instructors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear instructor')
  }

  return await response.json()
}

export async function updateInstructor(token, instructorId, formData) {
  const payload = {
    ...formData,
    anosExperiencia: parseInt(formData.anosExperiencia),
  }
  
  const response = await fetch(`${API_URL}/instructors/${instructorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar instructor')
  }

  return await response.json()
}

export async function deleteInstructor(token, instructorId) {
  const response = await fetch(`${API_URL}/instructors/${instructorId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al eliminar instructor')
  }

  return await response.json()
}
