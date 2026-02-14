/**
 * ProtectedRoute Component
 * @description Componente para proteger rutas que requieren autenticación
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './ui/Spinner'

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="auth-loading">
        <Spinner size="large" />
        <p>Verificando sesión...</p>
      </div>
    )
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return children
}

// Componente para rutas públicas (solo accesibles sin autenticación)
export const PublicRoute = ({ children, redirectTo = '/' }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-loading">
        <Spinner size="large" />
        <p>Cargando...</p>
      </div>
    )
  }

  // Redirigir a home si ya está autenticado
  if (user) {
    const from = location.state?.from?.pathname || redirectTo
    return <Navigate to={from} replace />
  }

  return children
}

export default ProtectedRoute
