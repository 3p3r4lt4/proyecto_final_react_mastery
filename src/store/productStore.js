/**
 * Product Store
 * @description Estado global para productos usando Zustand
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Constantes
const STORAGE_KEY = 'productstore-products'
const API_URL = 'https://dummyjson.com/products'

// Helper para generar IDs únicos
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

// Store de productos
export const useProductStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        products: [],
        loading: false,
        error: null,
        lastFetch: null,

        // Acciones

        /**
         * Cargar productos desde localStorage o API
         */
        fetchProducts: async (forceRefresh = false) => {
          const { products, lastFetch } = get()
          
          // Si ya hay productos y no se fuerza refresh, no hacer nada
          if (products.length > 0 && !forceRefresh) {
            return
          }

          set({ loading: true, error: null })

          try {
            const response = await fetch(API_URL)
            
            if (!response.ok) {
              throw new Error('Error al cargar productos')
            }

            const data = await response.json()
            
            set({ 
              products: data.products, 
              loading: false,
              lastFetch: Date.now()
            })
          } catch (error) {
            set({ 
              error: error.message || 'Error al cargar los productos', 
              loading: false 
            })
          }
        },

        /**
         * Obtener producto por ID
         */
        getProductById: (id) => {
          const { products } = get()
          const numericId = parseInt(id)
          return products.find(p => p.id === numericId || p.id === id)
        },

        /**
         * Agregar nuevo producto
         */
        addProduct: (productData) => {
          const { products } = get()
          
          const newProduct = {
            ...productData,
            id: generateId(),
            rating: 0,
            stock: parseInt(productData.stock) || 0,
            price: parseFloat(productData.price) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          set({ products: [newProduct, ...products] })
          
          return newProduct
        },

        /**
         * Actualizar producto existente
         */
        updateProduct: (id, updatedData) => {
          const { products } = get()
          
          const updatedProducts = products.map(product => {
            if (product.id === parseInt(id) || product.id === id) {
              return {
                ...product,
                ...updatedData,
                stock: parseInt(updatedData.stock) || product.stock,
                price: parseFloat(updatedData.price) || product.price,
                updatedAt: new Date().toISOString()
              }
            }
            return product
          })

          set({ products: updatedProducts })
        },

        /**
         * Eliminar producto
         */
        deleteProduct: (id) => {
          const { products } = get()
          const numericId = parseInt(id)
          
          const updatedProducts = products.filter(
            p => p.id !== numericId && p.id !== id
          )

          set({ products: updatedProducts })
        },

        /**
         * Resetear a datos de la API
         */
        resetToApi: async () => {
          set({ loading: true, error: null })

          try {
            const response = await fetch(API_URL)
            
            if (!response.ok) {
              throw new Error('Error al resetear productos')
            }

            const data = await response.json()
            
            set({ 
              products: data.products, 
              loading: false,
              lastFetch: Date.now()
            })

            return { success: true }
          } catch (error) {
            set({ 
              error: error.message || 'Error al resetear', 
              loading: false 
            })
            return { success: false, error: error.message }
          }
        },

        /**
         * Limpiar errores
         */
        clearError: () => set({ error: null }),

        /**
         * Buscar productos
         */
        searchProducts: (query) => {
          const { products } = get()
          const searchTerm = query.toLowerCase().trim()

          if (!searchTerm) return products

          return products.filter(product => 
            product.title?.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm)
          )
        },

        /**
         * Filtrar por categoría
         */
        filterByCategory: (category) => {
          const { products } = get()
          
          if (!category) return products
          
          return products.filter(
            product => product.category?.toLowerCase() === category.toLowerCase()
          )
        },

        /**
         * Obtener categorías únicas
         */
        getCategories: () => {
          const { products } = get()
          const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
          return categories.sort()
        },

        /**
         * Obtener estadísticas
         */
        getStats: () => {
          const { products } = get()
          
          return {
            total: products.length,
            totalStock: products.reduce((acc, p) => acc + (p.stock || 0), 0),
            totalValue: products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0),
            avgPrice: products.length > 0 
              ? products.reduce((acc, p) => acc + (p.price || 0), 0) / products.length 
              : 0,
            lowStock: products.filter(p => (p.stock || 0) < 10).length
          }
        }
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({ 
          products: state.products,
          lastFetch: state.lastFetch
        })
      }
    ),
    { name: 'ProductStore' }
  )
)

// Selectores para optimización
export const selectProducts = (state) => state.products
export const selectLoading = (state) => state.loading
export const selectError = (state) => state.error

export default useProductStore
