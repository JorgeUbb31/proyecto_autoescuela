import { useState } from 'react'
import * as userService from '../services/userService.js'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  // Fetch usuarios
  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const usersArray = await userService.fetchUsers(token)
      setUsers(usersArray)
    } catch (err) {
      setError(err.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Crear usuario
  const createUser = async (formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await userService.createUser(token, formData)
      await fetchUsers()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Actualizar usuario
  const updateUser = async (userId, formData) => {
    setSubmitLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await userService.updateUser(token, userId, formData)
      await fetchUsers()
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  // Eliminar usuario
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken')
      await userService.deleteUser(token, userId)
      setUsers(users.filter((u) => u.id !== userId))
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    users,
    loading,
    error,
    submitLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setError,
  }
}
