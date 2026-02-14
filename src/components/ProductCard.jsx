/**
 * ProductCard Component
 * @description Tarjeta de producto con diseño moderno
 */

import { Link } from 'react-router-dom'
import { memo } from 'react'

const ProductCard = memo(({ product, onDelete }) => {
  const {
    id,
    title,
    brand,
    price,
    rating,
    stock,
    thumbnail,
    category
  } = product

  // Determinar estado del stock
  const getStockStatus = () => {
    if (stock === 0) return { text: 'Agotado', class: 'out-of-stock' }
    if (stock < 10) return { text: 'Bajo stock', class: 'low-stock' }
    return { text: 'Disponible', class: 'in-stock' }
  }

  const stockStatus = getStockStatus()

  // Manejar error de imagen
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/200x200?text=Sin+imagen'
  }

  return (
    <article className="product-card">
      {/* Badge de categoría */}
      {category && (
        <span className="product-badge">{category}</span>
      )}

      {/* Imagen del producto */}
      <div className="product-image-container">
        <img
          src={thumbnail || 'https://via.placeholder.com/200x200?text=Sin+imagen'}
          alt={title}
          className="product-image"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* Overlay con acciones rápidas */}
        <div className="product-overlay">
          <Link 
            to={`/product/${id}`} 
            className="quick-action view"
            aria-label={`Ver detalles de ${title}`}
          >
            👁️
          </Link>
          <Link 
            to={`/edit/${id}`} 
            className="quick-action edit"
            aria-label={`Editar ${title}`}
          >
            ✏️
          </Link>
          <button
            className="quick-action delete"
            onClick={() => onDelete(product)}
            aria-label={`Eliminar ${title}`}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h3 className="product-title" title={title}>
          {title}
        </h3>
        
        {brand && (
          <p className="product-brand">{brand}</p>
        )}

        {/* Precio */}
        <p className="product-price">
          S/ {typeof price === 'number' ? price.toFixed(2) : '0.00'}
        </p>

        {/* Rating y Stock */}
        <div className="product-meta">
          <div className="product-rating" title={`Rating: ${rating || 0}`}>
            <span className="star">⭐</span>
            <span className="rating-value">{rating?.toFixed(1) || '0.0'}</span>
          </div>
          
          <div className={`product-stock ${stockStatus.class}`}>
            <span className="stock-dot"></span>
            <span>{stock} unidades</span>
          </div>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="product-actions">
        <Link 
          to={`/product/${id}`} 
          className="btn btn-primary btn-sm"
        >
          <span>👁️</span> Ver
        </Link>
        <Link 
          to={`/edit/${id}`} 
          className="btn btn-success btn-sm"
        >
          <span>✏️</span> Editar
        </Link>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(product)}
        >
          <span>🗑️</span>
        </button>
      </div>
    </article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
