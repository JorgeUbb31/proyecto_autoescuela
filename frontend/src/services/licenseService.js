import { API_URL } from '../config/app.config.js';

export async function fetchLicenses(token) {
  const response = await fetch(`${API_URL}/licenses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar licencias')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data?.data || [])
}

export async function createLicense(token, formData) {
  // Para subir archivos, usar FormData
  const data = new FormData()
  
  if (formData.instructorId) data.append('instructorId', formData.instructorId)
  if (formData.userId) data.append('userId', formData.userId)
  if (formData.numeroLicencia) data.append('numeroLicencia', formData.numeroLicencia)
  if (formData.tipoLicencia) data.append('tipoLicencia', formData.tipoLicencia)
  if (formData.categoria) data.append('categoria', formData.categoria)
  if (formData.fechaEmision) data.append('fechaEmision', formData.fechaEmision)
  if (formData.fechaVencimiento) data.append('fechaVencimiento', formData.fechaVencimiento)
  if (formData.activa !== undefined) data.append('activa', formData.activa ? 'true' : 'false')
  if (typeof formData.imagenRuta === 'string' && formData.imagenRuta.trim()) {
    data.append('imagenRuta', formData.imagenRuta)
  } else if (formData.imagenRuta && formData.imagenRuta instanceof File) {
    data.append('imagenRuta', formData.imagenRuta)
  }

  const response = await fetch(`${API_URL}/licenses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear licencia')
  }

  return await response.json()
}

export async function updateLicense(token, licenseId, formData) {
  // Para subir archivos, usar FormData
  const data = new FormData()
  
  if (formData.numeroLicencia) data.append('numeroLicencia', formData.numeroLicencia)
  if (formData.tipoLicencia) data.append('tipoLicencia', formData.tipoLicencia)
  if (formData.categoria) data.append('categoria', formData.categoria)
  if (formData.fechaVencimiento) data.append('fechaVencimiento', formData.fechaVencimiento)
  if (typeof formData.imagenRuta === 'string' && formData.imagenRuta.trim()) {
    data.append('imagenRuta', formData.imagenRuta)
  } else if (formData.imagenRuta && formData.imagenRuta instanceof File) {
    data.append('imagenRuta', formData.imagenRuta)
  }

  const response = await fetch(`${API_URL}/licenses/${licenseId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar licencia')
  }

  return await response.json()
}

export async function deleteLicense(token, licenseId) {
  const response = await fetch(`${API_URL}/licenses/${licenseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al eliminar licencia')
  }

  return await response.json()
}

export async function fetchLicenseSummary(token) {
  const response = await fetch(`${API_URL}/licenses/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error al cargar el resumen de licencias')
  }

  const data = await response.json()
  return data?.data || {}
}
