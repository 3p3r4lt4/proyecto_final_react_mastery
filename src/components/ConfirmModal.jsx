/**
 * ConfirmModal Component
 * @description Modal de confirmación reutilizable
 */

import { useEffect, useRef } from 'react'
import Button from './ui/Button'

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger',
  icon = '⚠️',
  onConfirm, 
  onCancel,
  loading = false
}) => {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Manejar focus trap y tecla Escape
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      modalRef.current?.focus()
      document.body.style.overflow = 'hidden'

      const handleEscape = (e) => {
        if (e.key === 'Escape' && !loading) {
          onCancel()
        }
      }

      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, loading, onCancel])

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onCancel()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content"
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="modal-icon">{icon}</div>
        
        <h3 id="modal-title" className="modal-title">{title}</h3>
        
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
