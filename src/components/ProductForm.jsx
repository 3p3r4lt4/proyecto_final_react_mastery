/**
 * ProductForm Component
 * @description Formulario de producto reutilizable
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from './ui/Input'
import Button from './ui/Button'

const ProductForm = ({ initialData, onSubmit, isEditing = false }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    stock: '',
    thumbnail: ''
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [imagePreviewError, setImagePreviewError] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        brand: initialData.brand || '',
        category: initialData.category || '',
        stock: initialData.stock?.toString() || '',
        thumbnail: initialData.thumbnail || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Reset imagen preview error cuando cambia la URL
    if (name === 'thumbnail') {
      setImagePreviewError(false)
    }

    // Limpiar error del campo
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
      case 'title':
        if (!value.trim()) {
          error = 'El título es requerido'
        } else if (value.length < 3) {
          error = 'Mínimo 3 caracteres'
        }
        break
      case 'description':
        if (!value.trim()) {
          error = 'La descripción es requerida'
        } else if (value.length < 10) {
          error = 'Mínimo 10 caracteres'
        }
        break
      case 'price':
        if (!value) {
          error = 'El precio es requerido'
        } else if (parseFloat(value) < 0) {
          error = 'El precio no puede ser negativo'
        }
        break
      case 'stock':
        if (!value && value !== 0) {
          error = 'El stock es requerido'
        } else if (parseInt(value) < 0) {
          error = 'El stock no puede ser negativo'
        }
        break
      case 'thumbnail':
        if (value && !isValidUrl(value)) {
          error = 'URL inválida'
        }
        break
      default:
        break
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const validateForm = () => {
    const fields = ['title', 'description', 'price', 'stock']
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
    
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    setImagePreviewError(true)
  }

  // Categorías sugeridas
  const suggestedCategories = [
    'beauty', 'fragrances', 'furniture', 'groceries', 
    'home-decoration', 'kitchen-accessories', 'laptops', 
    'mens-shirts', 'mens-shoes', 'mens-watches',
    'mobile-accessories', 'motorcycle', 'skin-care',
    'smartphones', 'sports-accessories', 'sunglasses',
    'tablets', 'tops', 'vehicle', 'womens-bags',
    'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches'
  ]

  return (
    <form onSubmit={handleSubmit} className="product-form" noValidate>
      <div className="form-header">
        <h2>{isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
        <p>{isEditing ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}</p>
      </div>

      <div className="form-grid">
        {/* Columna izquierda */}
        <div className="form-column">
          <Input
            label="Título"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nombre del producto"
            error={errors.title}
            touched={touched.title}
            required
          />

          <div className="form-group">
            <label className="form-label">
              Descripción <span className="required-mark">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input textarea ${touched.description && errors.description ? 'error' : ''}`}
              placeholder="Descripción detallada del producto"
              rows="4"
            />
            {touched.description && errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <Input
              label="Precio (S/)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              error={errors.price}
              touched={touched.price}
              required
              min="0"
              step="0.01"
            />

            <Input
              label="Stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0"
              error={errors.stock}
              touched={touched.stock}
              required
              min="0"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="form-column">
          <Input
            label="Marca"
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Marca del producto"
          />

          <div className="form-group">
            <label className="form-label">Categoría</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              placeholder="Selecciona o escribe una categoría"
              list="categories"
            />
            <datalist id="categories">
              {suggestedCategories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <Input
            label="URL de Imagen"
            type="url"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://ejemplo.com/imagen.jpg"
            error={errors.thumbnail}
            touched={touched.thumbnail}
          />

          {/* Vista previa de imagen */}
          {formData.thumbnail && (
            <div className="image-preview">
              <label className="form-label">Vista previa</label>
              <div className="preview-container">
                {!imagePreviewError ? (
                  <img
                    src={formData.thumbnail}
                    alt="Vista previa"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="preview-error">
                    <span>⚠️</span>
                    <p>No se pudo cargar la imagen</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/')}
          disabled={loading}
        >
          ❌ Cancelar
        </Button>
        <Button
          type="submit"
          variant="success"
          loading={loading}
        >
          {isEditing ? '💾 Guardar Cambios' : '➕ Crear Producto'}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm
