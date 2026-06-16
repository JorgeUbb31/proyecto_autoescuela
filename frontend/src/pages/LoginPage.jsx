import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useLoginForm } from '../hooks/useLoginForm.js'
import '../styles/auth.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, cargando } = useAuth()
  const { formData, error, handleChange, setError } = useLoginForm()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Autoescuela</h1>
        <h2>Iniciar Sesión</h2>

        {error && (
          <div className="alert alert-error">
            <span className="text-xl">✗</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <button
            type="submit"
            disabled={cargando}
            className="w-full btn-primary py-3 mt-2 animate-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Cargando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-primary font-semibold transition-colors duration-300 hover:text-secondary"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
