/**
 * Spinner Component
 * @description Componente de loading reutilizable
 */

const Spinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizeClasses = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg'
  }

  const colorClasses = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    dark: 'spinner-dark'
  }

  return (
    <div 
      className={`spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Cargando"
    >
      <span className="spinner-circle"></span>
    </div>
  )
}

export default Spinner
