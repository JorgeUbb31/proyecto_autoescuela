# Backend - Sistema de Autoescuela

Backend Node.js + Express + TypeORM + PostgreSQL para gestión de autoescuela.

## 📋 Requisitos

- Node.js v16+
- PostgreSQL 12+
- npm o yarn

## 🚀 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Base de Datos

#### Crear base de datos en PostgreSQL:
```sql
CREATE DATABASE autoescuela_db;
```

#### Crear usuario PostgreSQL (opcional):
```sql
CREATE USER autoescuela WITH PASSWORD 'contraseña_segura';
ALTER ROLE autoescuela WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE autoescuela_db TO autoescuela;
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz y `src/config/.env` con:

```env
# Servidor
PORT=3001
HOST=localhost

# Base de datos PostgreSQL
DB_USERNAME=postgres
PASSWORD=tu_contraseña
DATABASE=autoescuela_db
DB_HOST=localhost
DB_PORT=5432

# JWT
SESSION_SECRET=tu_clave_secreta_muy_larga
JWT_EXPIRATION=7d

# Ambiente
NODE_ENV=development
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/              # Configuración
│   │   ├── configDb.js     # TypeORM DataSource
│   │   ├── configEnv.js    # Variables de entorno
│   │   └── .env            # Archivo de variables
│   ├── controllers/         # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── license.controller.js
│   │   ├── instructor.controller.js
│   │   └── vehicle.controller.js
│   ├── entity/              # Modelos TypeORM
│   │   ├── user.entity.js
│   │   ├── license.entity.js
│   │   ├── instructor.entity.js
│   │   └── vehicle.entity.js
│   ├── middleware/          # Middleware Express
│   │   ├── authentication.middleware.js
│   │   └── authorization.middleware.js
│   ├── routes/              # Rutas API
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── license.routes.js
│   │   ├── instructor.routes.js
│   │   ├── vehicle.routes.js
│   │   └── index.routes.js
│   ├── validations/         # Esquemas Joi
│   │   ├── auth.validation.js
│   │   ├── license.validation.js
│   │   ├── instructor.validation.js
│   │   └── vehicle.validation.js
│   ├── helpers/             # Funciones auxiliares
│   └── services/            # Servicios reutilizables
├── server.js                # Archivo de entrada principal
├── package.json             # Dependencias
├── .env                     # Variables de entorno
├── .gitignore              # Archivos a ignorar
└── README.md               # Este archivo
```

## ▶️ Ejecución

### Desarrollo (con nodemon)
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3001`

## 📡 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario

### Instructores
- `POST /api/instructors` - Crear instructor (Admin)
- `GET /api/instructors` - Listar instructores
- `GET /api/instructors/:id` - Obtener instructor
- `PUT /api/instructors/:id` - Actualizar instructor
- `DELETE /api/instructors/:id` - Eliminar instructor (Admin)

### Licencias
- `POST /api/licenses` - Crear licencia
- `GET /api/licenses` - Listar licencias
- `GET /api/licenses/:id` - Obtener licencia
- `PUT /api/licenses/:id` - Actualizar licencia
- `DELETE /api/licenses/:id` - Eliminar licencia (Admin)

### Vehículos
- `POST /api/vehicles` - Crear vehículo (Admin)
- `GET /api/vehicles` - Listar vehículos
- `GET /api/vehicles/:id` - Obtener vehículo
- `PUT /api/vehicles/:id` - Actualizar vehículo (Admin)
- `DELETE /api/vehicles/:id` - Eliminar vehículo (Admin)
- `POST /api/vehicles/assign` - Asignar vehículo a instructor (Admin)
- `POST /api/vehicles/unassign` - Remover vehículo de instructor (Admin)

## 🔐 Autenticación

El API usa JWT. Para acceder a rutas protegidas, incluir token en header:

```
Authorization: Bearer <token>
```

## 📝 Roles y Permisos

| Rol | Licencias | Instructores | Vehículos |
|-----|-----------|--------------|-----------|
| Admin | CRUD | CRUD | CRUD |
| Instructor | CU | LU | L |
| Secretaria | L (filtrado) | L (filtrado) | L (disponibles) |
| Usuario | - | - | - |

**L** = Lectura, **C** = Crear, **U** = Actualizar, **D** = Eliminar

## 🛠️ Troubleshooting

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Connection refused" (PostgreSQL)
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`

### Error: "EADDRINUSE: address already in use"
- Puerto 3001 ya está en uso
- Cambiar `PORT` en `.env`

## 📚 Tecnologías Usadas

- **Express.js** - Framework web
- **TypeORM** - ORM para PostgreSQL
- **Joi** - Validación de esquemas
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **CORS** - Control de origen compartido
- **Dotenv** - Variables de entorno

## ✅ Checklist de Configuración

- [ ] Node.js instalado (v16+)
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `autoescuela_db` creada
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivos `.env` configurados
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Endpoint `/health` respondiendo

## 📞 Soporte

Para reportar problemas, crear un issue en el repositorio.
