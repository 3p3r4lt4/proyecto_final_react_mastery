/**
 * Toast Component
 * @description Sistema de notificaciones toast
 */

import { createContext, useContext, useState, useCallback } from 'react'

// Crear contexto para Toast
const ToastContext = createContext()

// Hook para usar toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider')
  }
  return context
}

// Provider de Toast
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    
    setToasts(prev => [...prev, { id, message, type }])

    // Auto-remover después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Métodos helper
  const success = useCallback((message, duration) => 
    addToast(message, 'success', duration), [addToast])
  
  const error = useCallback((message, duration) => 
    addToast(message, 'error', duration), [addToast])
  
  const warning = useCallback((message, duration) => 
    addToast(message, 'warning', duration), [addToast])
  
  const info = useCallback((message, duration) => 
    addToast(message, 'info', duration), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Contenedor de toasts
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  )
}

// Componente Toast individual
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Cerrar">
        ×
      </button>
    </div>
  )
}

export default Toast
