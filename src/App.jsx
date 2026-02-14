/**
 * App Component
 * @description Componente principal de la aplicación con rutas
 */

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute'

// Páginas públicas
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Páginas protegidas
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import EditPage from './pages/EditPage'
import ProductDetailPage from './pages/ProductDetailPage'

// Estilos
import './styles/index.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <div className="container">
          <Routes>
            {/* Rutas públicas (solo para usuarios no autenticados) */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />

            {/* Rutas protegidas (requieren autenticación) */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreatePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              } 
            />

            {/* Ruta 404 */}
            <Route 
              path="*" 
              element={
                <div className="page-error">
                  <div className="error-icon">🔍</div>
                  <h2>Página no encontrada</h2>
                  <p>La página que buscas no existe.</p>
                </div>
              } 
            />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
