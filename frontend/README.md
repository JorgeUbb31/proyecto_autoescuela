# 🎨 Frontend - Sistema de Autoescuela

Aplicación React para la gestión completa del sistema de autoescuela con interfaz moderna y responsive.

## 📋 Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Guía de Desarrollo](#guía-de-desarrollo)

---

## 📁 Estructura del Proyecto

```
src/
├── components/              # Componentes React reutilizables
│   ├── Navbar.jsx          # Barra de navegación
│   ├── Sidebar.jsx         # Menú lateral
│   ├── Table.jsx           # Tabla genérica
│   ├── Modal.jsx           # Modal reutilizable
│   ├── Form.jsx            # Formulario genérico
│   ├── ProtectedRoute.jsx  # Ruta protegida por autenticación
│   ├── AccessDenied.jsx    # Página de acceso denegado
│   └── DeleteConfirmationModal.jsx
│
├── pages/                  # Páginas/Vistas principales
│   ├── DashboardPage.jsx   # Panel principal
│   ├── LoginPage.jsx       # Login
│   ├── RegisterPage.jsx    # Registro
│   ├── UsersPage.jsx       # Gestión de usuarios
│   ├── InstructorsPage.jsx # Gestión de instructores
│   ├── VehiclesPage.jsx    # Gestión de vehículos
│   └── LicensesPage.jsx    # Gestión de licencias
│
├── services/               # Llamadas a API REST
│   ├── authService.js      # Endpoints de autenticación
│   ├── userService.js      # Endpoints de usuarios
│   ├── instructorService.js
│   ├── vehicleService.js
│   └── licenseService.js
│
├── hooks/                  # Custom React Hooks (lógica de componentes)
│   ├── useAuth.js          # Contexto de autenticación
│   ├── useUsers.js         # Lógica de usuarios
│   ├── useInstructors.js   # Lógica de instructores
│   ├── useVehicles.js      # Lógica de vehículos
│   ├── useLicenses.js      # Lógica de licencias
│   ├── useLoginForm.js     # Validación de formulario login
│   ├── useRegisterForm.js  # Validación de formulario registro
│   ├── useDashboard.js     # Lógica del dashboard
│   └── useSidebar.js       # Control del sidebar
│
├── context/                # Context API para estado global
│   ├── AuthContext.jsx     # Contexto de autenticación
│   └── SidebarContext.jsx  # Contexto del sidebar
│
├── config/                 # Configuración de la aplicación
│   └── api.js             # Cliente HTTP con Axios e interceptores
│
├── routes/                 # Configuración de rutas (extensible)
│
├── utils/                  # Funciones utilitarias
│   ├── idGenerator.js      # Generador de IDs temporales
│   ├── validation.js       # Funciones de validación
│   └── formatters.js       # Funciones de formato
│
├── assets/                 # Imágenes y archivos estáticos
│
├── styles/                 # CSS global
│   ├── App.css
│   ├── dashboard.css
│   ├── auth.css
│   ├── modal.css
│   └── index.css
│
├── main.jsx               # Punto de entrada
├── App.jsx                # Componente raíz
└── .env.local             # Variables de entorno (local)
```

---

## 🚀 Instalación

```bash
npm install
```

### Dependencias Principales

- **Vite 5** - Build tool moderno y rápido
- **React 18.2** - Librería UI
- **React Router 6** - Enrutamiento entre páginas
- **Axios** - Cliente HTTP moderno con interceptores
- **TailwindCSS** - Framework CSS utility-first

---

## ▶️ Ejecución

### Desarrollo

```bash
npm run dev
# La app estará en http://localhost:5173
```

### Producción

```bash
npm run build
npm run preview
```

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Vite | 5 | Build tool |
| React | 18.2 | UI Framework |
| React Router | 6 | Routing |
| Axios | Latest | HTTP Client |
| TailwindCSS | 3 | CSS Framework |

---

## 🏗️ Arquitectura

### Flujo de Datos

```
Page (Presentación)
  ↓
Hook (Lógica de componente)
  ↓
Service (Llamadas a API)
  ↓
API Client con Axios (Interceptores, tokens)
  ↓
Backend API REST
```

### Separación de Responsabilidades

- **Páginas**: Solo presentación (JSX)
- **Hooks**: Lógica y gestión de estado
- **Services**: Llamadas HTTP a backend
- **API Client**: Manejo de Axios, tokens, interceptores

---

## 🔐 Autenticación

### Flujo de Login

```
1. Usuario ingresa credenciales
   ↓
2. AuthContext.login(email, password)
   ↓
3. API Client POST /auth/login
   ↓
4. Backend devuelve JWT
   ↓
5. Guardar token en localStorage
   ↓
6. Redirigir a dashboard
```

### Tokens JWT Automáticos

El API Client agrega automáticamente el token JWT a todas las peticiones:

```javascript
// Antes: sin token
GET /api/users

// Después: con token (automático vía interceptor)
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Renovación Automática

Si el token expira (401/403), el interceptor:
1. Elimina el token de localStorage
2. Redirige automáticamente a /login
3. Muestra mensaje: "Sesión expirada"

---

## 📐 Patrones de Desarrollo

### ✅ Usar Hooks para Lógica

```javascript
export function UsersPage() {
  const { users, loading, error, fetchUsers } = useUsers()
  
  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <Table data={users} />
    </div>
  )
}
```

### ❌ No Mezclar Lógica en Páginas

```javascript
// ❌ Incorrecto - lógica en la página
export function UsersPage() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    // lógica aquí - No hacer esto!
    const token = localStorage.getItem('accessToken')
    fetch(`/api/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])
  
  return <div>{/* presentación */}</div>
}
```

### Manejo de Errores

```javascript
{error && (
  <div className="alert alert-error">
    <p>{error}</p>
    <button onClick={fetchUsers} className="btn-primary">
      Reintentar
    </button>
  </div>
)}
```

### Estados de Carga

```javascript
{loading ? (
  <div className="spinner">Cargando...</div>
) : users.length === 0 ? (
  <p className="text-gray-500">No hay registros</p>
) : (
  <Table columns={columns} data={users} />
)}
```

---

## 🎨 Estilos

- **TailwindCSS** para estilos utility-first
- **CSS personalizado** en `styles/` para estilos complejos
- **Animaciones** incluidas (fade, slide-up)

### Colores Principales

```css
--primary: #3B82F6 (Azul)
--secondary: #F59E0B (Naranja)
--success: #10B981 (Verde)
--error: #EF4444 (Rojo)
--warning: #F59E0B (Amarillo)
--beige: #F5F3F0 (Beige)
```

### Clases CSS Predefinidas

```html
<button class="btn-primary">Botón primario</button>
<button class="btn-secondary">Botón secundario</button>

<div class="alert alert-success">Mensaje de éxito</div>
<div class="alert alert-error">Mensaje de error</div>

<div class="animate-slide-up">Animación de entrada</div>
```

---

## 🔧 Utilidades Disponibles

### ID Generator (para IDs temporales)

```javascript
import { generateTempId, isTempId } from '@/utils/idGenerator.js'

// Generar ID temporal para elemento creado localmente
const tempId = generateTempId() // -1, -2, -3...

// Verificar si es temporal
if (isTempId(-1)) {
  // Es un ID temporal, no ha sido guardado en servidor
}
```

### Validación

```javascript
import { 
  isValidRut, 
  isValidEmail, 
  isValidPassword,
  isNotEmpty 
} from '@/utils/validation.js'

isValidRut('12.345.678-9') // true
isValidEmail('user@example.com') // true
isValidPassword('password123') // true
isNotEmpty('valor') // true
```

### Formatters

```javascript
import { 
  formatDate, 
  formatStatus, 
  capitalize,
  truncateText 
} from '@/utils/formatters.js'

formatDate('2024-06-16') // "16 de junio de 2024"
formatStatus(true) // "Activo"
capitalize('hola') // "Hola"
truncateText('Texto largo', 5) // "Texto..."
```

---

## ⚙️ Variables de Entorno

Crear archivo `.env.local` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3001/api
```

## 📦 Build para Producción

```bash
npm run build
# Genera carpeta dist/ lista para desplegar
```

El archivo `dist/` contiene todos los archivos estáticos necesarios para servir en un servidor web.

---

## 🤝 Contribuciones

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para:
- Convenciones de Git
- Estructura de ramas
- Estándares de código
- Proceso de desarrollo

---

**Versión:** 1.0.0  
**Última actualización:** Junio 2026  
**Para más información**, ver [README principal](../README.md)

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

const usuarios = await apiClient.get('/users')

const respuesta = await apiClient.post('/auth/login', { email, password })

const actualizado = await apiClient.put('/users/1', { nombre: 'Juan' })

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
