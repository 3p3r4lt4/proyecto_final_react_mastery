/**
 * LoginPage Component
 * @description Página de inicio de sesión
 */

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const toast = useToast()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  // Ruta a la que redirigir después del login
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'El email es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email inválido'
        }
        break
      case 'password':
        if (!value) {
          error = 'La contraseña es requerida'
        } else if (value.length < 6) {
          error = 'Mínimo 6 caracteres'
        }
        break
      default:
        break
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  const validateForm = () => {
    const emailValid = validateField('email', formData.email)
    const passwordValid = validateField('password', formData.password)
    
    setTouched({ email: true, password: true })
    
    return emailValid && passwordValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    const { error } = await signIn(formData.email, formData.password)

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('¡Bienvenido de vuelta!')
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Lado izquierdo - Decorativo */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-hero-icon">🛒</div>
            <h1>ProductStore</h1>
            <p>Gestiona tu inventario de productos de manera simple y eficiente</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="feature-icon">📦</span>
                <span>Catálogo completo</span>
              </div>
              <div className="auth-feature">
                <span className="feature-icon">📊</span>
                <span>Control de stock</span>
              </div>
              <div className="auth-feature">
                <span className="feature-icon">🔍</span>
                <span>Búsqueda rápida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="tu@email.com"
                error={errors.email}
                touched={touched.email}
                required
                icon="📧"
                autoComplete="email"
              />

              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                error={errors.password}
                touched={touched.password}
                required
                icon="🔒"
                autoComplete="current-password"
              />

              <div className="auth-options">
                <Link to="/forgot-password" className="auth-link-small">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
              >
                Ingresar
              </Button>
            </form>

            <div className="auth-divider">
              <span>o</span>
            </div>

            <p className="auth-footer-text">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
