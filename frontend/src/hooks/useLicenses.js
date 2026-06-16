import { useState } from 'react'
import * as licenseService from '../services/licenseService.js'

export function useLicenses() {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  // Fetch licencias
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

  // Crear licencia
  const createLicense = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await licenseService.createLicense(token, formData)
      await fetchLicenses()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Actualizar licencia
  const updateLicense = async (licenseId, formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await licenseService.updateLicense(token, licenseId, formData)
      await fetchLicenses()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Eliminar licencia
  const deleteLicense = async (licenseId) => {
    try {
      const token = localStorage.getItem('accessToken')
      await licenseService.deleteLicense(token, licenseId)
      setLicenses(licenses.filter((l) => l.id !== licenseId))
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    licenses,
    loading,
    error,
    submitLoading,
    fetchLicenses,
    createLicense,
    updateLicense,
    deleteLicense,
    setError,
  }
}
