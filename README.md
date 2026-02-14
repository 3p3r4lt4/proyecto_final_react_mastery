# 🛒 ProductStore - Sistema de Gestión de Productos

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat&logo=supabase)
![Zustand](https://img.shields.io/badge/Zustand-4.4.7-orange?style=flat)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)

Aplicación React moderna con autenticación Supabase para la gestión completa de productos (CRUD).

---

## ✨ Características

- ✅ **Autenticación completa** - Login, Registro y Logout con Supabase
- ✅ **CRUD de productos** - Crear, Leer, Actualizar y Eliminar
- ✅ **Búsqueda en tiempo real** - Filtrar productos por nombre o marca
- ✅ **Filtros por categoría** - Organización por categorías
- ✅ **Ordenamiento múltiple** - Por precio, nombre, rating o stock
- ✅ **Estadísticas en dashboard** - Total, Stock y Bajo stock
- ✅ **Rutas protegidas** - Acceso solo para usuarios autenticados
- ✅ **Diseño responsive** - Funciona en móvil, tablet y desktop
- ✅ **Notificaciones toast** - Feedback visual de acciones
- ✅ **Validación de formularios** - En tiempo real
- ✅ **Persistencia de datos** - LocalStorage con Zustand

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 18.2.0 | Biblioteca de UI |
| Vite | 5.0+ | Build tool y dev server |
| React Router | 6.21.0 | Navegación SPA |
| Zustand | 4.4.7 | Estado global |
| Supabase | 2.39.0 | Autenticación |
| CSS3 | - | Estilos personalizados |

---

## 📁 Estructura del Proyecto
```
src/
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes UI base
│   │   ├── Button.jsx       # Botón con variantes
│   │   ├── Input.jsx        # Input con validación
│   │   ├── Spinner.jsx      # Indicador de carga
│   │   └── Toast.jsx        # Sistema de notificaciones
│   ├── ConfirmModal.jsx     # Modal de confirmación
│   ├── Navbar.jsx           # Barra de navegación
│   ├── ProductCard.jsx      # Tarjeta de producto
│   ├── ProductForm.jsx      # Formulario de producto
│   └── ProtectedRoute.jsx   # Componente de ruta protegida
├── context/                 # Contextos de React
│   └── AuthContext.jsx      # Contexto de autenticación
├── hooks/                   # Hooks personalizados
│   └── useForm.js           # Hook para manejo de formularios
├── lib/                     # Configuraciones externas
│   └── supabase.js          # Cliente de Supabase
├── pages/                   # Páginas de la aplicación
│   ├── CreatePage.jsx       # Crear producto
│   ├── EditPage.jsx         # Editar producto
│   ├── HomePage.jsx         # Dashboard principal
│   ├── LoginPage.jsx        # Inicio de sesión
│   ├── ProductDetailPage.jsx # Detalle de producto
│   └── RegisterPage.jsx     # Registro de usuario
├── store/                   # Estado global
│   └── productStore.js      # Store de productos (Zustand)
├── styles/                  # Estilos CSS
│   └── index.css            # Estilos principales
├── App.jsx                  # Componente principal con rutas
└── main.jsx                 # Punto de entrada
```

---

## 🚀 Instalación y Configuración

### Requisitos previos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase

### Paso 1: Clonar o descargar el proyecto
```bash
cd proyecto_final_react_mastery
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 4: Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🔐 Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar URL y Anon Key desde Settings > API

### 2. Configurar autenticación

En el dashboard de Supabase:

1. Ir a **Authentication** > **Providers**
2. Habilitar **Email**
3. (Opcional) Desactivar "Confirm email" para desarrollo rápido

---

## 📱 Funcionalidades por Página

### 🔑 Login (`/login`)
- Formulario de inicio de sesión
- Validación de email y contraseña
- Redirección automática al dashboard
- Link a registro

### 📝 Registro (`/register`)
- Formulario de registro completo
- Validación de contraseña (mayúsculas, minúsculas, 6+ caracteres)
- Confirmación de contraseña
- Mensaje de éxito con instrucciones

### 🏠 Dashboard (`/`)
- Grid de productos con tarjetas
- Estadísticas: Total, En stock, Bajo stock
- Barra de búsqueda en tiempo real
- Filtro por categoría
- Ordenamiento (precio, nombre, rating, stock)
- Botón de resetear datos

### ➕ Crear Producto (`/create`)
- Formulario completo con validación
- Vista previa de imagen
- Categorías sugeridas
- Notificación de éxito

### ✏️ Editar Producto (`/edit/:id`)
- Carga de datos existentes
- Mismas validaciones que crear
- Actualización en tiempo real

### 👁️ Detalle de Producto (`/product/:id`)
- Vista completa del producto
- Imagen grande
- Especificaciones detalladas
- Navegación con breadcrumb

---

## 🎨 Personalización

### Cambiar colores principales

Editar variables CSS en `src/styles/index.css`:
```css
:root {
  --primary: #4f46e5;        /* Color principal (morado) */
  --primary-dark: #4338ca;   /* Hover del principal */
  --success: #10b981;        /* Verde para éxito */
  --danger: #ef4444;         /* Rojo para errores */
  --warning: #f59e0b;        /* Amarillo para alertas */
}
```

### Cambiar fuente

En `index.html`, modificar el link de Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=TU-FUENTE&display=swap" rel="stylesheet">
```

Y en CSS:
```css
:root {
  --font-sans: 'TU-FUENTE', sans-serif;
}
```

---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm run preview` | Vista previa de build |
| `npm run lint` | Ejecuta ESLint |

---

## 🔄 Flujo de Autenticación
```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO NO AUTENTICADO               │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   /login o /register  │
              └───────────┬───────────┘
                          │
                          ▼ Login exitoso
              ┌───────────────────────┐
              │    AuthContext        │
              │  (guarda sesión)      │
              └───────────┬───────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  USUARIO AUTENTICADO                    │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────────┐  │
│  │    /    │  │ /create │  │/edit/:id│  │/product/:id│ │
│  │  Home   │  │ Crear   │  │ Editar  │  │  Detalle   │ │
│  └─────────┘  └─────────┘  └─────────┘  └───────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Almacenamiento de Datos

### Productos
- **Ubicación**: LocalStorage del navegador
- **Key**: `productstore-products`
- **Persistencia**: Zustand con middleware `persist`

### Sesión de usuario
- **Ubicación**: Manejado por Supabase
- **Persistencia**: Automática con tokens JWT

---

## 🐛 Solución de Problemas

### Error: "Invalid login credentials"
- Verificar email y contraseña
- Confirmar email si está habilitado en Supabase

### Error: "Failed to resolve import @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
```

### Productos no se guardan
- Verificar que LocalStorage no esté bloqueado
- Limpiar caché del navegador

### Estilos no cargan
- Verificar import en `App.jsx`: `import './styles/index.css'`

---

## 👨‍💻 Autor

**Eduardo Peralta**

- GitHub: [@eduardo7sistemas](https://github.com/eduardo7sistemas)
- Email: eduardo7sistemas@gmail.com

---

## 📄 Licencia

Este proyecto es parte del **Proyecto Final del Curso de React**.

MIT License - Siéntete libre de usar este código como base para tus proyectos.

---

## 🙏 Agradecimientos

- [React](https://react.dev/) - Biblioteca de UI
- [Vite](https://vitejs.dev/) - Build tool
- [Supabase](https://supabase.com/) - Backend as a Service
- [Zustand](https://zustand-demo.pmnd.rs/) - Estado global
- [DummyJSON](https://dummyjson.com/) - API de productos de prueba

---

⭐ **¡Si este proyecto te fue útil, dale una estrella!** ⭐