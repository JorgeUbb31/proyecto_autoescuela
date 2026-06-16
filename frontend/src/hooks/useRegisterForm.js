import { useState } from 'react'

export function useRegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    rut: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    // Las contraseñas deben coincidir
    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden')
      return false
    }

    // Longitud mínima
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    return true
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      rut: '',
      password: '',
      passwordConfirm: '',
    })
    setError('')
    setSuccess('')
  }

  return {
    formData,
    error,
    success,
    handleChange,
    setError,
    setSuccess,
    validateForm,
    resetForm,
  }
}
