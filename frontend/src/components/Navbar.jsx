import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/dashboard.css'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const initials = useMemo(() => {
    if (!usuario?.username) return 'U'
    return usuario.username
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [usuario?.username])

  const roleLabel = useMemo(() => {
    if (!usuario?.role) return 'Usuario'
    return usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1)
  }, [usuario?.role])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsAccountMenuOpen(false)
    try {
      await logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  return (
    <nav className="navbar navbar-glass">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-mark">A</div>
          <div>
            <h1>Autoescuela</h1>
            <p>Gestión premium</p>
          </div>
        </div>

        <div className="navbar-actions" ref={menuRef}>
          <button
            className="account-toggle"
            onClick={() => setIsAccountMenuOpen((prev) => !prev)}
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="menu"
          >
            <div className="account-avatar">{initials}</div>
            <div className="account-summary">
              <span>{usuario?.username || 'Usuario'}</span>
              <small>{roleLabel}</small>
            </div>
            <span className={`account-caret ${isAccountMenuOpen ? 'open' : ''}`}>⌄</span>
          </button>

          {isAccountMenuOpen && (
            <div className="account-menu" role="menu">
              <div className="account-menu-header">
                <div className="account-avatar large">{initials}</div>
                <div>
                  <strong>{usuario?.username || 'Usuario'}</strong>
                  <p>{usuario?.email || 'Sin correo registrado'}</p>
                </div>
              </div>

              <div className="account-menu-divider" />

              <button
                className="account-menu-item"
                type="button"
                onClick={() => {
                  window.location.href = '/profile'
                  setIsAccountMenuOpen(false)
                }}
              >
                <span>👤</span>
                Mi perfil
              </button>

              <button
                className="account-menu-item"
                type="button"
                onClick={() => {
                  window.location.href = '/settings'
                  setIsAccountMenuOpen(false)
                }}
              >
                <span>⚙️</span>
                Configuración
              </button>

              <div className="account-menu-divider" />

              <button className="account-menu-item danger" onClick={handleLogout} type="button">
                <span>↺</span>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
