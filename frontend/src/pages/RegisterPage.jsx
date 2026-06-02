import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/auth.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { registro, cargando } = useAuth()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      await registro(formData.username, formData.email, formData.rut, formData.password)
      setSuccess('¡Registro exitoso! Por favor inicia sesión')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al registrarse')
    }
  }

  return (
    <div className="auth-container py-8">
      <div className="auth-card">
        <h1>Autoescuela</h1>
        <h2>Crear Cuenta</h2>

        {error && (
          <div className="alert alert-error">
            <span className="text-xl">✗</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span className="text-xl">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="tu_usuario"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rut">RUT</label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              required
              placeholder="12.345.678-9"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">Confirmar Contraseña</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full btn-primary py-3 mt-2 animate-slide-up"
            style={{ animationDelay: '0.7s' }}
          >
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Cargando...
              </span>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-primary font-semibold transition-colors duration-300 hover:text-secondary"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
