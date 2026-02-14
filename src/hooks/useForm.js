/**
 * useForm Hook
 * @description Hook personalizado para manejo de formularios
 */

import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Manejar cambios en inputs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  // Manejar blur (cuando el campo pierde foco)
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validar campo individual si hay función de validación
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: validationErrors[name]
        }))
      }
    }
  }, [values, validate])

  // Establecer valor programáticamente
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Establecer múltiples valores
  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }))
  }, [])

  // Establecer error programáticamente
  const setError = useCallback((name, message) => {
    setErrors(prev => ({
      ...prev,
      [name]: message
    }))
  }, [])

  // Limpiar todos los errores
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // Resetear formulario
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    if (!validate) return true

    const validationErrors = validate(values)
    setErrors(validationErrors)
    
    // Marcar todos los campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    return Object.keys(validationErrors).length === 0
  }, [values, validate])

  // Manejar submit
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateForm])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setMultipleValues,
    setError,
    clearErrors,
    reset,
    validateForm,
    setIsSubmitting
  }
}

// Validadores comunes
export const validators = {
  required: (value) => !value?.toString().trim() ? 'Este campo es requerido' : '',
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(value) ? 'Email inválido' : ''
  },
  
  minLength: (min) => (value) => 
    value.length < min ? `Mínimo ${min} caracteres` : '',
  
  maxLength: (max) => (value) => 
    value.length > max ? `Máximo ${max} caracteres` : '',
  
  match: (fieldName, fieldValue) => (value) => 
    value !== fieldValue ? `No coincide con ${fieldName}` : '',
  
  number: (value) => isNaN(Number(value)) ? 'Debe ser un número' : '',
  
  positive: (value) => Number(value) <= 0 ? 'Debe ser mayor a 0' : '',
  
  url: (value) => {
    if (!value) return ''
    try {
      new URL(value)
      return ''
    } catch {
      return 'URL inválida'
    }
  }
}

export default useForm
