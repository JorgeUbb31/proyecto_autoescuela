# 🚗 Sistema de Gestión de Autoescuela

**Plataforma integral para la administración de autoescuelas**, incluyendo gestión de instructores, vehículos, licencias y usuarios con control de acceso basado en roles.

## 📋 Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución](#ejecución)
- [Documentación](#documentación)

---

## 📝 Descripción

Este proyecto es una solución completa para autoescuelas que necesitan:

✅ **Gestión de Usuarios**: Crear y administrar usuarios con diferentes roles  
✅ **Gestión de Instructores**: Registrar instructores con especialización y experiencia  
✅ **Gestión de Vehículos**: Inventario de vehículos disponibles para lecciones  
✅ **Gestión de Licencias**: Control de licencias de conducir de instructores  
✅ **Control de Acceso**: Sistema RBAC (Role-Based Access Control) con JWT  

### Roles del Sistema

- **Administrador**: Acceso total a todas las funcionalidades
- **Instructor**: Gestión de vehículos asignados y licencias
- **Profesor**: Gestión de licencias
- **Secretaria**: Visualización de datos disponibles
- **Usuario**: Acceso básico de lectura

---

## 🛠️ Tecnologías

### Backend
- **Node.js 16+** - Runtime de JavaScript
- **Express 4.x** - Framework web
- **PostgreSQL 12+** - Base de datos relacional
- **TypeORM 0.3** - ORM para Node.js
- **JWT** - Autenticación y autorización
- **Joi** - Validación de esquemas
- **Bcrypt** - Hash seguro de contraseñas

### Frontend
- **Vite 5** - Build tool moderno
- **React 18.2** - Librería UI
- **React Router 6** - Enrutamiento
- **Axios** - Cliente HTTP
- **TailwindCSS** - Framework CSS utility-first
- **Context API** - Gestión de estado global

---

## 📁 Estructura del Repositorio

```
proyecto_autoescuela/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuración de DB y env
│   │   ├── controllers/   # Controladores HTTP
│   │   ├── services/      # Lógica de negocio
│   │   ├── entity/        # Esquemas TypeORM
│   │   ├── middleware/    # Middlewares (Auth, etc)
│   │   ├── routes/        # Rutas API REST
│   │   ├── validations/   # Esquemas Joi
│   │   ├── helpers/       # Funciones de utilidad
│   │   └── index.js       # Entrada principal
│   ├── package.json
│   ├── README.md          # Documentación backend
│   └── uploads/           # Archivos subidos
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas (views)
│   │   ├── services/      # Llamadas a API
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── context/       # Context API
│   │   ├── routes/        # Rutas del frontend
│   │   ├── assets/        # Imágenes y archivos estáticos
│   │   ├── styles/        # CSS global
│   │   ├── utils/         # Funciones de utilidad
│   │   ├── config/        # Configuración (API, etc)
│   │   ├── main.jsx       # Punto de entrada
│   │   └── App.jsx        # Componente raíz
│   ├── package.json
│   ├── README.md          # Documentación frontend
│   └── index.html
│
├── AGENTS.md              # Instrucciones para agentes IA
├── README.md              # Este archivo
└── .git/                  # Control de versiones
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js v16 o superior
- PostgreSQL v12 o superior
- Git

### Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd proyecto_autoescuela
```

### Paso 2: Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DATABASE=autoescuela_db
SESSION_SECRET=tu_secret_jwt_aqui
JWT_EXPIRATION=7d
```

Crear la base de datos:
```bash
createdb autoescuela_db  # En PostgreSQL
```

### Paso 3: Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env.local`:
```env
VITE_API_URL=http://localhost:3001/api
```

---

## ▶️ Ejecución

### Modo Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# El servidor estará en http://localhost:3001/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# La aplicación estará en http://localhost:5173
```

### Modo Producción

**Backend:**
```bash
npm run build
npm start
```

**Frontend:**
```bash
npm run build
# Los archivos estáticos están en dist/
```

---

## 📚 Documentación

Para documentación más específica y detallada, consulta:

- **[Backend README](./backend/README.md)** - Guía técnica del servidor, endpoints, y base de datos
- **[Frontend README](./frontend/README.md)** - Guía del cliente, componentes, y estado

---

## 👥 Roles y Permisos

| Rol | Usuarios | Instructores | Vehículos | Licencias |
|-----|----------|--------------|-----------|-----------|
| Administrador | CRUD | CRUD | CRUD | CRUD |
| Instructor | R | R (propio) | R | CRUD (propio) |
| Profesor | - | - | - | CRUD |
| Secretaria | R | R | R | R |
| Usuario | - | - | - | - |

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con Bcrypt (10 rondas)
- ✅ JWT para autenticación sin estado
- ✅ Validación de entrada con Joi
- ✅ RBAC (Role-Based Access Control)
- ✅ Mensajes de error genéricos en login
- ✅ Variables de entorno protegidas

---

## 📝 Convenciones de Código

### Git Commits

Usar mensajes descriptivos y específicos:

```
✨ feat: Agregar gestión de licencias
🐛 fix: Corregir validación de RUT en formulario
📦 refactor: Separar lógica de controllers a services
🎨 style: Mejorar estilos de tabla
📚 docs: Actualizar documentación de API
🧪 test: Agregar pruebas unitarias
```

### Ramas

- `main` - Rama de producción (estable)
- `repuesto` - Rama de respaldo
- `develop` - Rama de desarrollo
- `feature/*` - Ramas para nuevas funcionalidades

---

## 🤝 Contribuciones

Se recomienda:

1. Crear una rama `feature/` para cambios nuevos
2. Hacer commits frecuentes y descriptivos
3. Mantener la separación entre Controllers y Services
4. Documentar cambios importantes

---

## 📄 Licencia

[Especificar licencia]

---

**Última actualización:** Junio 2026  
**Versión:** 1.0.0
