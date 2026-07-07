import { useState } from 'react'

export default function Form({ fields, onSubmit, loading = false, submitLabel = 'Guardar', children }) {
  const [formData, setFormData] = useState(() => {
    const initial = {}
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue || ''
    })
    return initial
  })
  const [files, setFiles] = useState({})
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked, files: fileList } = e.target
    
    if (type === 'file') {
      setFiles((prev) => ({
        ...prev,
        [name]: fileList?.[0] || null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
    
    // Limpiar error del campo cuando se empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validación básica de campos requeridos
    const newErrors = {}
    fields.forEach((field) => {
      if (field.required && field.type !== 'file' && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es requerido`
      }
      if (field.required && field.type === 'file' && !files[field.name]) {
        newErrors[field.name] = `${field.label} es requerido`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Si hay archivos, usar FormData; si no, usar objeto JSON
      const hasFiles = Object.keys(files).length > 0 && Object.values(files).some(f => f !== null)
      
      let dataToSend = formData
      if (hasFiles) {
        dataToSend = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
          dataToSend.append(key, value)
        })
        Object.entries(files).forEach(([key, file]) => {
          if (file) {
            dataToSend.append(key, file)
          }
        })
      }
      
      await onSubmit(dataToSend)
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors)
      } else {
        setErrors({ submit: err.message || 'Error al guardar' })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="alert alert-error mb-4">
          <p>{errors.submit}</p>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`input-field w-full ${errors[field.name] ? 'border-red-500' : ''}`}
            >
              <option value="">{field.placeholder || 'Seleccionar...'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className={`input-field w-full ${errors[field.name] ? 'border-red-500' : ''}`}
            />
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={formData[field.name]}
                onChange={handleChange}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
                {field.label}
              </label>
            </div>
          ) : field.type === 'file' ? (
            <div className="flex flex-col">
              <input
                id={field.name}
                type="file"
                name={field.name}
                onChange={handleChange}
                accept={field.accept || 'image/*'}
                className={`block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary cursor-pointer ${errors[field.name] ? 'border-red-500' : ''}`}
              />
              {files[field.name] && (
                <p className="text-sm text-green-600 mt-2">
                  Archivo seleccionado: {files[field.name].name}
                </p>
              )}
            </div>
          ) : (
            <input
              id={field.name}
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`input-field w-full ${errors[field.name] ? 'border-red-500' : ''}`}
            />
          )}

          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {children}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
