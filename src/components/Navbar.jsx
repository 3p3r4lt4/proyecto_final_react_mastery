/**
 * Navbar Component
 * @description Barra de navegación con soporte de autenticación
 */

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from './ui/Toast'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSignOut = async () => {
    const { error } = await signOut()
    
    if (error) {
      toast.error('Error al cerrar sesión')
    } else {
      toast.success('¡Hasta pronto!')
      navigate('/login')
    }
    
    setProfileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!user?.email) return '?'
    const name = user.user_metadata?.full_name || user.email
    return name.charAt(0).toUpperCase()
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛒</span>
          <span className="brand-text">ProductStore</span>
        </Link>

        {/* Navegación principal - Desktop */}
        {user && (
          <div className="navbar-nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Inicio
            </Link>
            <Link 
              to="/create" 
              className={`nav-link ${isActive('/create') ? 'active' : ''}`}
            >
              <span className="nav-icon">+</span>
              Nuevo Producto
            </Link>
          </div>
        )}

        {/* Sección derecha */}
        <div className="navbar-right">
          {user ? (
            <>
              {/* Perfil de usuario */}
              <div className="user-menu">
                <button 
                  className="user-menu-trigger"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="user-avatar">
                    {getUserInitials()}
                  </div>
                  <span className="user-email">{user.email}</span>
                  <span className={`dropdown-arrow ${profileOpen ? 'open' : ''}`}>▼</span>
                </button>

                {profileOpen && (
                  <>
                    <div 
                      className="menu-backdrop"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {getUserInitials()}
                        </div>
                        <div className="dropdown-user-info">
                          <span className="dropdown-name">
                            {user.user_metadata?.full_name || 'Usuario'}
                          </span>
                          <span className="dropdown-email">{user.email}</span>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <button 
                        className="dropdown-item danger"
                        onClick={handleSignOut}
                      >
                        <span>🚪</span>
                        Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          )}

          {/* Menú móvil */}
          {user && (
            <button 
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
            >
              <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil expandido */}
      {user && menuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className={`mobile-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            🏠 Inicio
          </Link>
          <Link 
            to="/create" 
            className={`mobile-link ${isActive('/create') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            ➕ Nuevo Producto
          </Link>
          <div className="mobile-divider" />
          <button 
            className="mobile-link danger"
            onClick={handleSignOut}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
