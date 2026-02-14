/**
 * RegisterPage Component
 * @description Página de registro de usuarios
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
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
      case 'name':
        if (!value.trim()) {
          error = 'El nombre es requerido'
        } else if (value.length < 2) {
          error = 'Mínimo 2 caracteres'
        }
        break
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
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
          error = 'Debe incluir mayúsculas y minúsculas'
        }
        break
      case 'confirmPassword':
        if (!value) {
          error = 'Confirma tu contraseña'
        } else if (value !== formData.password) {
          error = 'Las contraseñas no coinciden'
        }
        break
      default:
        break
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  const validateForm = () => {
    const fields = ['name', 'email', 'password', 'confirmPassword']
    let isValid = true
    
    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false
      }
    })
    
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}))
    
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    const { data, error } = await signUp(formData.email, formData.password, {
      full_name: formData.name
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      setSuccess(true)
      toast.success('¡Cuenta creada exitosamente!')
    }
  }

  // Pantalla de éxito
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container single">
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h2>¡Registro Exitoso!</h2>
                <p>
                  Hemos enviado un correo de confirmación a{' '}
                  <strong>{formData.email}</strong>
                </p>
                <p className="success-hint">
                  Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
                <div className="success-actions">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => navigate('/login')}
                  >
                    Ir al Login
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSuccess(false)}
                  >
                    Usar otro email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Lado izquierdo - Decorativo */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-hero-icon">🚀</div>
            <h1>Únete a ProductStore</h1>
            <p>Crea tu cuenta y comienza a gestionar tus productos hoy mismo</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="feature-icon">✨</span>
                <span>Gratis para empezar</span>
              </div>
              <div className="auth-feature">
                <span className="feature-icon">🔐</span>
                <span>Datos seguros</span>
              </div>
              <div className="auth-feature">
                <span className="feature-icon">⚡</span>
                <span>Configuración rápida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Crear Cuenta</h2>
              <p>Completa el formulario para registrarte</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <Input
                label="Nombre completo"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tu nombre"
                error={errors.name}
                touched={touched.name}
                required
                icon="👤"
                autoComplete="name"
              />

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
                placeholder="Mínimo 6 caracteres"
                error={errors.password}
                touched={touched.password}
                required
                icon="🔒"
                helperText="Incluye mayúsculas y minúsculas"
                autoComplete="new-password"
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repite tu contraseña"
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                required
                icon="🔒"
                autoComplete="new-password"
              />

              <div className="auth-terms">
                <p>
                  Al registrarte, aceptas nuestros{' '}
                  <a href="#terms">Términos de Servicio</a> y{' '}
                  <a href="#privacy">Política de Privacidad</a>
                </p>
              </div>

              <Button
                type="submit"
                variant="success"
                size="large"
                fullWidth
                loading={loading}
              >
                Crear Cuenta
              </Button>
            </form>

            <div className="auth-divider">
              <span>o</span>
            </div>

            <p className="auth-footer-text">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="auth-link">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage