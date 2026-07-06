import { useState } from 'react'
import * as vehicleService from '../services/vehicleService.js'

export function useVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  // Fetch vehículos
  const fetchVehicles = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const vehiclesArray = await vehicleService.fetchVehicles(token)
      setVehicles(vehiclesArray)
    } catch (err) {
      setError(err.message)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  // Crear vehículo
  const createVehicle = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await vehicleService.createVehicle(token, formData)
      await fetchVehicles()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Actualizar vehículo
  const updateVehicle = async (vehicleId, formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await vehicleService.updateVehicle(token, vehicleId, formData)
      await fetchVehicles()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Actualizar estado de mantenimiento
  const updateMaintenance = async (vehicleId, payload) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await vehicleService.updateMaintenance(token, vehicleId, payload)
      await fetchVehicles()
      return response
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Eliminar vehículo
  const deleteVehicle = async (vehicleId) => {
    try {
      const token = localStorage.getItem('accessToken')
      await vehicleService.deleteVehicle(token, vehicleId)
      setVehicles(vehicles.filter((v) => v.id !== vehicleId))
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    vehicles,
    loading,
    error,
    submitLoading,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    updateMaintenance,
    deleteVehicle,
    setError,
  }
}
