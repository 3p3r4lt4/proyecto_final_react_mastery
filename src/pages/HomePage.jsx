/**
 * HomePage Component
 * @description Página principal con listado de productos
 */

import { useEffect, useState, useMemo } from 'react'
import { useProductStore } from '../store/productStore'
import { useToast } from '../components/ui/Toast'
import ProductCard from '../components/ProductCard'
import ConfirmModal from '../components/ConfirmModal'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'

const HomePage = () => {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    deleteProduct, 
    resetToApi,
    getCategories,
    getStats
  } = useProductStore()

  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('default')

  // Cargar productos al montar
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Obtener categorías únicas
  const categories = useMemo(() => getCategories(), [products, getCategories])

  // Obtener estadísticas
  const stats = useMemo(() => getStats(), [products, getStats])

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.title?.toLowerCase().includes(search) ||
        p.brand?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      )
    }

    // Filtrar por categoría
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Ordenar
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'name-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      case 'name-desc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
        break
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'stock':
        result.sort((a, b) => (b.stock || 0) - (a.stock || 0))
        break
      default:
        break
    }

    return result
  }, [products, searchTerm, selectedCategory, sortBy])

  // Handlers
  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setDeleteLoading(true)
    
    try {
      deleteProduct(productToDelete.id)
      toast.success(`"${productToDelete.title}" eliminado correctamente`)
    } catch (err) {
      toast.error('Error al eliminar el producto')
    } finally {
      setDeleteLoading(false)
      setModalOpen(false)
      setProductToDelete(null)
    }
  }

  const cancelDelete = () => {
    setModalOpen(false)
    setProductToDelete(null)
  }

  const handleReset = async () => {
    const { success, error } = await resetToApi()
    
    if (success) {
      toast.success('Productos restaurados desde la API')
      setSearchTerm('')
      setSelectedCategory('')
      setSortBy('default')
    } else {
      toast.error(error || 'Error al restaurar productos')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSortBy('default')
  }

  // Estados de loading y error
  if (loading && products.length === 0) {
    return (
      <div className="page-loading">
        <Spinner size="large" />
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="page-error">
        <div className="error-icon">❌</div>
        <h2>Error al cargar productos</h2>
        <p>{error}</p>
        <Button onClick={() => fetchProducts(true)}>
          🔄 Reintentar
        </Button>
      </div>
    )
  }

  const hasFilters = searchTerm || selectedCategory || sortBy !== 'default'

  return (
    <div className="home-page">
      {/* Header con estadísticas */}
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            <span className="title-icon">📦</span>
            Productos
            <span className="product-count">({filteredProducts.length})</span>
          </h1>
          
          {/* Stats rápidas */}
          <div className="quick-stats">
            <div className="stat">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.totalStock}</span>
              <span className="stat-label">En stock</span>
            </div>
            {stats.lowStock > 0 && (
              <div className="stat warning">
                <span className="stat-value">{stats.lowStock}</span>
                <span className="stat-label">Bajo stock</span>
              </div>
            )}
          </div>
        </div>

        <div className="header-actions">
          <Button 
            variant="secondary" 
            onClick={handleReset}
            icon="🔄"
          >
            Resetear
          </Button>
        </div>
      </header>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="default">Ordenar por...</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
          <option value="rating">Mejor Rating</option>
          <option value="stock">Mayor Stock</option>
        </select>

        {hasFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No se encontraron productos</h3>
          <p>
            {hasFilters 
              ? 'Intenta con otros filtros de búsqueda'
              : '¡Crea tu primer producto!'}
          </p>
          {hasFilters && (
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Eliminar producto"
        message={`¿Estás seguro de eliminar "${productToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        icon="🗑️"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleteLoading}
      />
    </div>
  )
}

export default HomePage
