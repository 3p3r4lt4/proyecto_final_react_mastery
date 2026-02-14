/**
 * Authentication Context
 * @description Manejo centralizado del estado de autenticación
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Crear contexto con valor por defecto
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {}
})

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Inicializar sesión al montar el componente
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Obtener sesión actual
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (mounted) {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (mounted) {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
          setLoading(false)
        }

        // Log de eventos para debugging
        if (import.meta.env.DEV) {
          console.log('Auth event:', event)
        }
      }
    )

    // Cleanup
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Función para iniciar sesión
  const signIn = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: {
          message: translateError(error.message)
        }
      }
    }
  }, [])

  // Función para registrar usuario
  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: metadata
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: {
          message: translateError(error.message)
        }
      }
    }
  }, [])

  // Función para cerrar sesión
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { 
        error: {
          message: translateError(error.message)
        }
      }
    }
  }, [])

  // Función para recuperar contraseña
  const resetPassword = useCallback(async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      )

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: {
          message: translateError(error.message)
        }
      }
    }
  }, [])

  // Valor del contexto
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper para traducir errores de Supabase
function translateError(message) {
  const translations = {
    'Invalid login credentials': 'Credenciales inválidas. Verifica tu email y contraseña.',
    'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión.',
    'User already registered': 'Este email ya está registrado.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'El formato del email no es válido.',
    'Signup requires a valid password': 'La contraseña es requerida.',
    'Anonymous sign-ins are disabled': 'El registro anónimo está deshabilitado.',
    'Email rate limit exceeded': 'Demasiados intentos. Espera unos minutos.',
    'For security purposes, you can only request this once every 60 seconds': 'Por seguridad, espera 60 segundos antes de intentar nuevamente.'
  }

  return translations[message] || message
}

export default AuthContext