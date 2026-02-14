/**
 * CreatePage Component
 * @description Página para crear nuevos productos
 */

import { useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useToast } from '../components/ui/Toast'
import ProductForm from '../components/ProductForm'

const CreatePage = () => {
  const navigate = useNavigate()
  const { addProduct } = useProductStore()
  const toast = useToast()

  const handleSubmit = async (formData) => {
    try {
      const newProduct = addProduct(formData)
      toast.success(`"${newProduct.title}" creado exitosamente`)
      navigate('/')
    } catch (error) {
      toast.error('Error al crear el producto')
    }
  }

  return (
    <div className="create-page">
      <ProductForm
        onSubmit={handleSubmit}
        isEditing={false}
      />
    </div>
  )
}

export default CreatePage
