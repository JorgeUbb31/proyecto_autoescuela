import { useState } from 'react'
import * as instructorService from '../services/instructorService.js'
import * as userService from '../services/userService.js'
import * as licenseService from '../services/licenseService.js'

export function useInstructors() {
  const [instructors, setInstructors] = useState([])
  const [users, setUsers] = useState([])
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  // Fetch instructores
  const fetchInstructors = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const instructorsArray = await instructorService.fetchInstructors(token)
      setInstructors(instructorsArray)
    } catch (err) {
      setError(err.message)
      setInstructors([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch usuarios
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const usersArray = await userService.fetchUsers(token)
      setUsers(usersArray)
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
    }
  }

  const fetchLicenses = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const licensesArray = await licenseService.fetchLicenses(token)
      setLicenses(licensesArray)
    } catch (err) {
      console.error('Error al cargar licencias:', err)
    }
  }

  const createProfessor = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await userService.updateUserRole(token, formData.userId, 'profesor')
      await licenseService.createLicense(token, {
        ...formData,
        userId: formData.userId,
        activa: formData.activa !== false,
      })
      await loadData()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Crear instructor
  const createInstructor = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await instructorService.createInstructor(token, formData)
      await fetchInstructors()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Actualizar instructor
  const updateInstructor = async (instructorId, formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await instructorService.updateInstructor(token, instructorId, formData)
      await fetchInstructors()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Eliminar instructor
  const deleteInstructor = async (instructorId) => {
    try {
      const token = localStorage.getItem('accessToken')
      await instructorService.deleteInstructor(token, instructorId)
      setInstructors(instructors.filter((i) => i.id !== instructorId))
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Cargar datos iniciales
  const loadData = async () => {
    await fetchInstructors()
    await fetchUsers()
    await fetchLicenses()
  }

  return {
    instructors,
    users,
    licenses,
    loading,
    error,
    submitLoading,
    fetchInstructors,
    fetchUsers,
    createProfessor,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    loadData,
    setError,
  }
}
