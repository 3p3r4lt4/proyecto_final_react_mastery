/**
 * Input Component
 * @description Componente de input reutilizable con soporte para errores
 */

import { forwardRef, useState } from 'react'

const Input = forwardRef(({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  icon = null,
  className = '',
  helperText,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  
  const hasError = touched && error
  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`form-group ${hasError ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        
        <input
          ref={ref}
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`input ${icon ? 'has-icon' : ''} ${type === 'password' ? 'has-password-toggle' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
      {helperText && !hasError && (
        <span className="helper-text">{helperText}</span>
      )}
      
      {hasError && (
        <span id={`${name}-error`} className="error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input