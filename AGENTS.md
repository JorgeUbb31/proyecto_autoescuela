# AI Agent Instructions — Autoescuela Platform

This is a full-stack driving school management platform built with **Node.js + Express + TypeORM + PostgreSQL** (backend) and **Vite + React** (frontend). This document helps AI agents understand the codebase structure, conventions, and key patterns to be immediately productive.

---

## Quick Start

**Backend:**
```bash
cd backend
npm install
npm run dev          # Runs on http://localhost:3001/api
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev          # Runs on http://localhost:5173
```

**Database setup:** See [backend/README.md](backend/README.md) for PostgreSQL + `.env` configuration.

---

## Architecture Overview

```
Backend (Node.js/Express/TypeORM)      Frontend (Vite/React)
├── Controllers                        ├── Services (HTTP calls to /api)
├── Validations (Joi)                 ├── Context (state management)
├── Middleware (Auth/Authz)           ├── Pages & Components
├── Routes (REST endpoints)            └── Styles
├── Entities (TypeORM schemas)
├── Helpers (bcrypt, etc)
└── Config (DB, env vars)
```

**API Base URL:** `http://localhost:3001/api`

---

## Domain Model: Entities & Relationships

### **Core Entities**

| Entity | Key Fields | Relations | Notes |
|--------|-----------|-----------|-------|
| **User** | id, username, email, rut, password, role, timestamps | Base for all users | Role: `administrador`, `instructor`, `profesor`, `secretaria`, `usuario` |
| **Instructor** | id, userId (FK), rut, especializacion, anosExperiencia, activo | Many-to-One User; Many-to-Many Vehicles; One-to-Many Licenses | Extension of User with teaching credentials |
| **Vehicle** | id, matricula, marca, modelo, año, tipo, transmision, vencimientoPatente, disponible | Many-to-Many Instructors | Available for assignment to instructors |
| **License** | id, instructorId (FK), tipoLicencia, numeroLicencia, categoria, fechaVencimiento | Many-to-One Instructor | License credentials for instructors |

**Unique Constraints:**
- User: `username`, `email`, `rut` (Chilean ID format: `XX.XXX.XXX-X`)
- Vehicle: `matricula`
- License: `numeroLicencia`

**Example Relationships:**
```
User → Instructor → Vehicles (many-to-many)
User → Instructor → Licenses (one-to-many)
```

### **File References:**
- Entities: [backend/src/entity/](backend/src/entity/)
- Controllers: [backend/src/controllers/](backend/src/controllers/)
- Validations: [backend/src/validations/](backend/src/validations/)

---

## Authentication & Authorization

### **Authentication Flow (JWT)**

1. **Register:** `POST /api/auth/register` → Creates User → No token returned
2. **Login:** `POST /api/auth/login` → Validates email/password → Returns `{ accessToken }`
3. **Subsequent Requests:** `Authorization: Bearer <token>`
4. **Middleware:** `authenticateJwt` decodes JWT → sets `req.user`

**JWT Payload:**
```javascript
{ id, username, email, rut, role, iat, exp }
```

**First user auto-becomes admin** during registration if user count is 0.

### **Authorization (RBAC)**

**Middleware Files:**
- [backend/src/middleware/authentication.middleware.js](backend/src/middleware/authentication.middleware.js)
- [backend/src/middleware/authorization.middleware.js](backend/src/middleware/authorization.middleware.js)

**Current Pattern (⚠️ NOT best practice):**
Role checks are **inline in route handlers**, not extracted to dedicated middleware:
```javascript
// ❌ Current pattern (fragmented)
router.post('/vehicles', authenticateJwt, (req, res) => {
  if (req.user.role !== 'administrador') return res.status(403).send('Forbidden');
  // ... handler
});

// ✅ Better pattern (use middleware)
router.post('/vehicles', authenticateJwt, isAdmin, vehicleController.create);
```

**Role-Based Access:**
- **Administrador:** Full CRUD on Users, Instructors, Vehicles, Licenses
- **Instructor/Profesor:** Read own data, manage assigned Vehicles, view Licenses
- **Secretaria:** Read-only filtered data (e.g., only available vehicles where `disponible: true`)
- **Usuario:** Read public data only

### **Frontend Token Management:**
- **Storage:** `localStorage` key: `"accessToken"`
- **API Client:** [frontend/config/api.config.js](frontend/config/api.config.js)
- **Service Pattern:** [frontend/services/auth.service.js](frontend/services/auth.service.js)

---

## Code Organization Patterns

### **Backend File Structure**

```
backend/src/
├── config/
│   ├── configDb.js         # TypeORM DataSource + PostgreSQL
│   ├── configEnv.js        # Environment variables
│   └── initdb.js           # Seed data (runs on startup)
├── controllers/            # Business logic (validate → query → respond)
├── entity/                 # TypeORM EntitySchema definitions
├── helpers/                # Pure functions (bcrypt.helper.js)
├── middleware/             # JWT auth, role checks
├── routes/                 # Express routers with inline role checks
├── validations/            # Joi input schemas
├── services/               # ⚠️ Empty (not in use; logic is in controllers)
└── index.js                # Express server setup
```

### **Controller Pattern**

Controllers follow a consistent request → validate → operate → respond pattern:

```javascript
// Example: Create vehicle
async createVehicle(req, res) {
  // 1. Validate input
  const { error, value } = vehicleValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  
  // 2. Query repository
  const newVehicle = await AppDataSource.getRepository('Vehiculo').save(value);
  
  // 3. Respond
  return res.status(201).json(newVehicle);
}
```

**Key Pattern:** Controllers are **NOT** injected with services; they directly use `AppDataSource.getRepository()`.

### **Entity Definition Pattern (TypeORM EntitySchema)**

Entities use `EntitySchema` objects (not decorators):

```javascript
export default new EntitySchema({
  name: 'Vehiculo',
  tableName: 'vehiculos',
  columns: {
    id: { type: 'int', primary: true, generated: true },
    matricula: { type: 'varchar', unique: true, nullable: false },
    // ... more columns
  },
  relations: {
    instructores: {
      type: 'many-to-many',
      target: 'Instructor',
      joinTable: {
        name: 'instructor_vehiculo',
        joinColumn: { name: 'vehiculo_id' },
        inverseJoinColumn: { name: 'instructor_id' }
      }
    }
  }
});
```

### **Validation Pattern (Joi)**

All endpoints validate input with Joi schemas:

```javascript
// validations/vehicle.validation.js
const vehicleSchema = Joi.object({
  matricula: Joi.string().required(),
  marca: Joi.string().required(),
  modelo: Joi.string().required(),
  // ...
});

export const vehicleValidation = {
  validate: (data) => vehicleSchema.validate(data)
};
```

---

## Route Structure & API Endpoints

**Base:** `/api`

| Endpoint | Method | Auth | Role | Notes |
|----------|--------|------|------|-------|
| `/auth/register` | POST | ❌ | - | Public signup |
| `/auth/login` | POST | ❌ | - | Returns `accessToken` |
| `/users` | GET/POST/DELETE | ✅ | Admin | User management |
| `/instructors` | GET/POST/PUT/DELETE | ✅ | Admin/Instructor | Instructor management |
| `/vehicles` | GET/POST/PUT/DELETE | ✅ | Admin (Write); Secretaria (Read filtered) | Vehicle management |
| `/licenses` | GET/POST/DELETE | ✅ | Admin/Instructor | License management |

**Auth Applied At:**
- Global middleware on `/api` routes: `authenticateJwt`
- Per-route role checks: **inline in handlers** (not recommended; see Authorization section)

### **File References:**
- All routes: [backend/src/routes/](backend/src/routes/)
- Example (with inline role checks): [backend/src/routes/vehicle.routes.js](backend/src/routes/vehicle.routes.js)

---

## Key Development Patterns

### **✅ Good Patterns**

1. **Consistent Bcrypt Hashing**
   - File: [backend/src/helpers/bcrypt.helper.js](backend/src/helpers/bcrypt.helper.js)
   - Salt rounds: 10
   - Separate `encrypt()` and `compare()` functions

2. **Strict Input Validation (Joi)**
   - All endpoints validate against Joi schemas before processing
   - Example: [backend/src/validations/auth.validation.js](backend/src/validations/auth.validation.js)

3. **RUT/Email Uniqueness Enforcement**
   - Database unique constraints + application-level validation
   - Critical for Chilean identifiers (RUT format: `XX.XXX.XXX-X`)

4. **Defensive Relation Loading**
   - Entities load relations on-demand with `.leftJoinAndSelect()` or `.relations: []`

### **⚠️ Anti-patterns & Known Issues**

1. **`synchronize: true` in Production** ❌
   - Current: `[backend/src/config/configDb.js](backend/src/config/configDb.js)` uses auto-schema generation
   - Risk: Data loss, no migration tracking
   - Fix: Implement proper migrations (consider TypeORM migrations)

2. **Role Checks Inline in Routes** ❌
   - Scattered authorization logic; not reusable
   - Example: [backend/src/routes/vehicle.routes.js](backend/src/routes/vehicle.routes.js)
   - Fix: Extract to `isAdmin()`, `isInstructor()` middleware

3. **Services Folder Empty** ❌
   - Logic directly in controllers (tight coupling)
   - Fix: Implement service layer for reusability

4. **No Pagination** ❌
   - `getVehicles()`, `getLicenses()` fetch ALL records
   - Fix: Add `limit`, `offset` query params

5. **JWT Token Expiry Mismatch**
   - No refresh token mechanism
   - 1-day expiry = forced re-login
   - Frontend doesn't handle 401/403 gracefully

6. **Hardcoded Email Domain** ❌
   - Validation requires `@gmail.com` or `@gmail.cl`
   - Fix: Use standard email regex or remove domain restriction

7. **No Custom Error Types** ❌
   - All errors return generic 500 responses
   - Fix: Create custom exception classes

---

## Database Setup & Migrations

### **Connection Configuration**
File: [backend/src/config/configDb.js](backend/src/config/configDb.js)

```javascript
new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.PASSWORD,
  database: process.env.DATABASE || "autoescuela_db",
  entities: ["src/entity/**/*.js"],
  synchronize: true,  // ⚠️ Auto-creates schema
  logging: false,
});
```

### **Seed Data**
File: [backend/src/config/initdb.js](backend/src/config/initdb.js)

- Runs on server startup if `users` table is empty
- Inserts test users with hashed passwords
- Sets first user as admin

### **Environment Variables**
Create `.env` at backend root (see [backend/README.md](backend/README.md)):

```env
PORT=3001
DB_USERNAME=postgres
PASSWORD=your_password
DATABASE=autoescuela_db
SESSION_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
```

---

## Frontend Integration

### **Tech Stack**
- **Vite 5** + React 18.2 + React Router 6
- **State:** React Context API (no Redux/Zustand)
- **HTTP:** Custom APIClient (no Axios/Fetch wrapper library)

### **API Client Pattern**
File: [frontend/config/api.config.js](frontend/config/api.config.js)

```javascript
class APIClient {
  obtenerToken()              // Read accessToken from localStorage
  guardarToken(token)         // Save to localStorage
  eliminarToken()             // Clear on logout
  async get(url)              // GET with Bearer header
  async post(url, data)       // POST with Bearer header
  async put(url, data)        // PUT with Bearer header
  async delete(url)           // DELETE with Bearer header
}
```

### **Service Pattern**
Each domain has a service file for API calls:
- [frontend/services/auth.service.js](frontend/services/auth.service.js)
- [frontend/services/user.service.js](frontend/services/user.service.js)
- [frontend/services/instructor.service.js](frontend/services/instructor.service.js)
- [frontend/services/vehicle.service.js](frontend/services/vehicle.service.js)
- [frontend/services/license.service.js](frontend/services/license.service.js)

### **Environment Variables**
Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
```

Access in code via `import.meta.env.VITE_API_URL`

### **Known Frontend Issues** ⚠️
- No error handling for 401/403 responses (no redirect to login)
- No refresh token mechanism
- Token stored in `localStorage` (not HttpOnly; vulnerable to XSS)

---

## Common Tasks for AI Agents

### **Adding a New Entity**
1. Create entity file: `backend/src/entity/yourEntity.entity.js`
2. Define columns, relations, unique constraints
3. Add controller: `backend/src/controllers/yourEntity.controller.js`
4. Add validation: `backend/src/validations/yourEntity.validation.js`
5. Add route: `backend/src/routes/yourEntity.routes.js`
6. Add service: `frontend/services/yourEntity.service.js` (HTTP wrapper)
7. Update `backend/src/routes/index.routes.js` to register router

### **Adding an API Endpoint**
1. Add validation schema in `backend/src/validations/`
2. Add controller method in `backend/src/controllers/`
3. Add route in `backend/src/routes/` with inline role check
4. Call endpoint from frontend service
5. Handle response in React component/Context

### **Fixing Authorization**
**Current issue:** Role checks are inline in routes (fragmented).

**Steps to refactor:**
1. Extract role checks to middleware functions (e.g., `isAdmin.js`)
2. Update all routes to use middleware stack
3. Example: Replace inline check with `router.delete('/:id', authenticateJwt, isAdmin, controller.delete)`

### **Adding Pagination**
1. Update controller queries to use `skip` + `take`
2. Add query params: `?page=1&limit=10`
3. Return metadata: `{ data: [...], total, page, limit }`

---

## Special Notes

- **RUT Format:** All RUTs must follow Chilean format `XX.XXX.XXX-X` (validation in [backend/src/validations/](backend/src/validations/))
- **First User = Admin:** The first registered user automatically becomes `administrador`
- **TypeORM Entities as Objects:** Uses `EntitySchema` (not decorators); see [backend/src/entity/](backend/src/entity/) for examples
- **Controllers = Business Logic:** Controllers call `AppDataSource.getRepository()` directly (no service injection)
- **Frontend `.env.local`:** Vite exposes environment variables with `VITE_` prefix only

---

## Recommended Next Steps

For improving code quality, consider:

1. **[Extract Authorization Middleware](agent-instructions/extract-auth-middleware.md)** - Move inline role checks to reusable middleware
2. **[Add Services Layer](agent-instructions/add-services-layer.md)** - Refactor controllers to use services for better testability
3. **[Implement Pagination](agent-instructions/add-pagination.md)** - Add limit/offset to all list endpoints
4. **[Add Error Handling](agent-instructions/add-error-handling.md)** - Create custom exception classes and global error middleware
5. **[Setup Migrations](agent-instructions/setup-migrations.md)** - Replace `synchronize: true` with proper TypeORM migrations

---

**Last Updated:** April 2026
**Domain:** Driving School Management (Autoescuela)
**Frontend:** React 18 + Vite
**Backend:** Node.js 16+ + Express 4 + TypeORM 0.3 + PostgreSQL 12+
