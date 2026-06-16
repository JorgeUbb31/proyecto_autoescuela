import { useState } from 'react'

export function useLoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
    })
    setError('')
  }

  return {
    formData,
    error,
    handleChange,
    setError,
    resetForm,
  }
}
