# Frontend - Autoescuela Platform

## Estructura del Proyecto

```
src/
├── assets/          # Imágenes, logos, recursos estáticos
├── components/      # Componentes reutilizables (Navbar, Sidebar, etc.)
├── context/         # Contextos globales (AuthContext)
├── helpers/         # Funciones utilitarias (APIClient)
├── hooks/           # Hooks personalizados (useAuth)
├── pages/           # Páginas completas (Login, Dashboard, etc.)
├── services/        # Servicios para llamadas a APIs
├── styles/          # Archivos CSS globales
├── App.jsx          # Componente raíz
├── App.css          # Estilos de App
├── main.jsx         # Punto de entrada
└── index.css        # Estilos globales
```

## Configuración Base Completada

✅ **Estructura de carpetas** - Todas las carpetas creadas
✅ **APIClient** - Cliente HTTP con manejo de tokens
✅ **AuthContext** - Contexto global para autenticación
✅ **useAuth Hook** - Hook personalizado para acceder al contexto
✅ **React Router** - Configurado en App.jsx
✅ **Estilos globales** - CSS base incluido

## Variables de Entorno

El archivo `.env.local` está configurado con:
```
VITE_API_URL=http://localhost:3001/api
```

## Próximos Pasos

### 1. Crear Páginas de Autenticación
- `src/pages/LoginPage.jsx` - Página de login
- `src/pages/RegisterPage.jsx` - Página de registro

### 2. Crear Componentes Comunes
- `src/components/Navbar.jsx` - Barra de navegación
- `src/components/Sidebar.jsx` - Menú lateral
- `src/components/ProtectedRoute.jsx` - Ruta protegida

### 3. Crear Servicios
- `src/services/auth.service.js` - Funciones de autenticación
- `src/services/user.service.js` - Funciones de usuarios
- `src/services/instructor.service.js` - Funciones de instructores
- etc.

### 4. Crear Páginas Principales
- `src/pages/DashboardPage.jsx`
- `src/pages/UsersPage.jsx`
- `src/pages/InstructorsPage.jsx`
- `src/pages/VehiclesPage.jsx`
- `src/pages/LicensesPage.jsx`

## Cómo Usar

### AuthContext en un componente:
```javascript
import { useAuth } from '../hooks/useAuth'

function MiComponente() {
  const { usuario, login, logout, estaAutenticado } = useAuth()
  
  // Tu código aquí
}
```

### Hacer llamadas a la API:
```javascript
import apiClient from '../helpers/api'

// GET
const usuarios = await apiClient.get('/users')

// POST
const respuesta = await apiClient.post('/auth/login', { email, password })

// PUT
const actualizado = await apiClient.put('/users/1', { nombre: 'Juan' })

// DELETE
await apiClient.delete('/users/1')
```

## Instalación

```bash
cd frontend
npm install
npm run dev
```

Accede a `http://localhost:5173`

---

**Siguiente paso:** Crear páginas de autenticación
