const API_URL = import.meta.env.VITE_API_URL

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
  if (formData.numeroLicencia) data.append('numeroLicencia', formData.numeroLicencia)
  if (formData.tipoLicencia) data.append('tipoLicencia', formData.tipoLicencia)
  if (formData.categoria) data.append('categoria', formData.categoria)
  if (formData.fechaVencimiento) data.append('fechaVencimiento', formData.fechaVencimiento)
  if (formData.imagenRuta && formData.imagenRuta instanceof File) {
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
  if (formData.imagenRuta && formData.imagenRuta instanceof File) {
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
