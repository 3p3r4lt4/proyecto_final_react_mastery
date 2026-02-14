/**
 * ProductDetailPage Component
 * @description Página de detalle de producto
 */

import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { useEffect, useState } from 'react'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, fetchProducts, products } = useProductStore()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (products.length === 0) {
        await fetchProducts()
      }

      const foundProduct = getProductById(id)
      
      if (foundProduct) {
        setProduct(foundProduct)
      }
      
      setLoading(false)
    }

    loadProduct()
  }, [id, getProductById, fetchProducts, products.length])

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="page-loading">
        <Spinner size="large" />
        <p>Cargando producto...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-error">
        <div className="error-icon">🔍</div>
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o fue eliminado.</p>
        <Button onClick={() => navigate('/')}>
          ← Volver al inicio
        </Button>
      </div>
    )
  }

  const {
    title,
    description,
    price,
    brand,
    category,
    stock,
    rating,
    thumbnail,
    images = []
  } = product

  // Determinar estado del stock
  const getStockStatus = () => {
    if (stock === 0) return { text: 'Agotado', class: 'out-of-stock', icon: '🔴' }
    if (stock < 10) return { text: 'Últimas unidades', class: 'low-stock', icon: '🟡' }
    return { text: 'Disponible', class: 'in-stock', icon: '🟢' }
  }

  const stockStatus = getStockStatus()

  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span className="separator">/</span>
        {category && (
          <>
            <span>{category}</span>
            <span className="separator">/</span>
          </>
        )}
        <span className="current">{title}</span>
      </nav>

      {/* Botón volver */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      {/* Contenido principal */}
      <div className="product-detail">
        {/* Galería de imágenes */}
        <div className="detail-gallery">
          <div className="main-image-container">
            {!imageError ? (
              <img
                src={thumbnail}
                alt={title}
                className="main-image"
                onError={handleImageError}
              />
            ) : (
              <div className="image-placeholder">
                <span>📷</span>
                <p>Imagen no disponible</p>
              </div>
            )}

            {/* Badge de categoría */}
            {category && (
              <span className="category-badge">{category}</span>
            )}
          </div>

          {/* Thumbnails si hay múltiples imágenes */}
          {images.length > 1 && (
            <div className="thumbnail-gallery">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  className="thumbnail-btn"
                  onClick={() => {/* Cambiar imagen principal */}}
                >
                  <img src={img} alt={`${title} - ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="detail-info">
          {/* Header */}
          <header className="detail-header">
            <h1 className="detail-title">{title}</h1>
            {brand && <p className="detail-brand">por {brand}</p>}
          </header>

          {/* Rating */}
          <div className="detail-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < Math.floor(rating || 0) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-value">{rating?.toFixed(1) || '0.0'}</span>
          </div>

          {/* Precio */}
          <div className="detail-price">
            <span className="currency">S/</span>
            <span className="amount">{typeof price === 'number' ? price.toFixed(2) : '0.00'}</span>
          </div>

          {/* Stock */}
          <div className={`detail-stock ${stockStatus.class}`}>
            <span className="stock-icon">{stockStatus.icon}</span>
            <span className="stock-text">{stockStatus.text}</span>
            <span className="stock-quantity">({stock} unidades)</span>
          </div>

          {/* Descripción */}
          <div className="detail-description">
            <h3>Descripción</h3>
            <p>{description || 'Sin descripción disponible.'}</p>
          </div>

          {/* Especificaciones */}
          <div className="detail-specs">
            <h3>Especificaciones</h3>
            <dl className="specs-list">
              <div className="spec-item">
                <dt>Marca</dt>
                <dd>{brand || 'No especificada'}</dd>
              </div>
              <div className="spec-item">
                <dt>Categoría</dt>
                <dd>{category || 'No especificada'}</dd>
              </div>
              <div className="spec-item">
                <dt>Stock disponible</dt>
                <dd>{stock} unidades</dd>
              </div>
              <div className="spec-item">
                <dt>Valoración</dt>
                <dd>⭐ {rating?.toFixed(1) || '0.0'} / 5.0</dd>
              </div>
            </dl>
          </div>

          {/* Acciones */}
          <div className="detail-actions">
            <Link to={`/edit/${id}`} className="btn btn-success btn-lg">
              ✏️ Editar Producto
            </Link>
            <Button
              variant="secondary"
              size="large"
              onClick={() => navigate('/')}
            >
              📦 Ver todos los productos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
