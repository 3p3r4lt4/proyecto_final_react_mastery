/**
 * EditPage Component
 * @description Página para editar productos existentes
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useToast } from '../components/ui/Toast'
import ProductForm from '../components/ProductForm'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { useEffect, useState } from 'react'

const EditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, updateProduct, fetchProducts, products } = useProductStore()
  const toast = useToast()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      // Si no hay productos, cargarlos primero
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

  const handleSubmit = async (formData) => {
    try {
      updateProduct(id, formData)
      toast.success(`"${formData.title}" actualizado exitosamente`)
      navigate('/')
    } catch (error) {
      toast.error('Error al actualizar el producto')
    }
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

  return (
    <div className="edit-page">
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  )
}

export default EditPage
