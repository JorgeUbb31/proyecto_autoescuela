/**
 * GUÍA DE USO - SERVICIOS DEL FRONTEND
 * 
 * Todos los servicios están preparados para comunicarse con el backend
 * Manejan autenticación JWT, errores y tokens automáticamente
 */

// ============================================
// EJEMPLOS DE USO EN COMPONENTES
// ============================================

// ============ AUTENTICACIÓN ============
/*
import { authService } from "@/services";

// REGISTRO
async function handleRegistro() {
  try {
    const respuesta = await authService.registro({
      username: "juan_instructor",
      rut: "12.345.678-9",
      email: "juan@autoescuela.cl",
      password: "password123"
    });
    console.log("Usuario registrado:", respuesta);
  } catch (error) {
    console.error("Error en registro:", error.message);
  }
}

// LOGIN
async function handleLogin() {
  try {
    const respuesta = await authService.login({
      email: "juan@autoescuela.cl",
      password: "password123"
    });
    console.log("Login exitoso:", respuesta);
    // El token se guarda automáticamente
  } catch (error) {
    console.error("Error en login:", error.message);
  }
}

// LOGOUT
async function handleLogout() {
  try {
    await authService.logout();
    console.log("Sesión cerrada");
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
}

// VERIFICAR AUTENTICACIÓN
if (authService.estaAutenticado()) {
  console.log("Usuario autenticado");
}
*/

// ============ INSTRUCTORES ============
/*
import { instructorService } from "@/services";

// OBTENER TODOS
async function cargarInstructores() {
  try {
    const instructores = await instructorService.obtenerTodos();
    console.log("Instructores:", instructores);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// OBTENER UNO
async function cargarInstructor(id) {
  try {
    const instructor = await instructorService.obtenerPorId(id);
    console.log("Instructor:", instructor);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// CREAR
async function crearInstructor() {
  try {
    const respuesta = await instructorService.crear({
      userId: 2,
      rut: "15.789.456-3",
      especializacion: "Conducción segura",
      correo: "juan@autoescuela.cl",
      anosExperiencia: 8,
      telefono: "+56912345678"
    });
    console.log("Instructor creado:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ACTUALIZAR
async function actualizarInstructor(id) {
  try {
    const respuesta = await instructorService.actualizar(id, {
      especializacion: "Conducción defensiva",
      anosExperiencia: 9
    });
    console.log("Instructor actualizado:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ELIMINAR
async function eliminarInstructor(id) {
  try {
    const respuesta = await instructorService.eliminar(id);
    console.log("Instructor eliminado:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// OBTENER LICENCIAS DEL INSTRUCTOR
async function cargarLicenciasInstructor(id) {
  try {
    const licencias = await instructorService.obtenerLicencias(id);
    console.log("Licencias:", licencias);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// OBTENER VEHÍCULOS DEL INSTRUCTOR
async function cargarVehiculosInstructor(id) {
  try {
    const vehiculos = await instructorService.obtenerVehiculos(id);
    console.log("Vehículos asignados:", vehiculos);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
*/

// ============ VEHÍCULOS ============
/*
import { vehicleService } from "@/services";

// OBTENER TODOS
async function cargarVehiculos() {
  try {
    const vehiculos = await vehicleService.obtenerTodos();
    console.log("Vehículos:", vehiculos);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// OBTENER DISPONIBLES
async function cargarVehiculosDisponibles() {
  try {
    const vehiculos = await vehicleService.obtenerDisponibles();
    console.log("Vehículos disponibles:", vehiculos);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// CREAR
async function crearVehiculo() {
  try {
    const respuesta = await vehicleService.crear({
      matricula: "AAAA-11",
      marca: "Toyota",
      modelo: "Corolla",
      ano: 2022,
      tipo: "AUTO",
      transmision: "MANUAL",
      vencimientoPatente: "2027-06-30",
      vencimientoRevisionTecnica: "2026-12-31",
      disponible: true
    });
    console.log("Vehículo creado:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ASIGNAR A INSTRUCTOR
async function asignarVehiculo(instructorId, vehicleId) {
  try {
    const respuesta = await vehicleService.asignarAlInstructor(instructorId, vehicleId);
    console.log("Vehículo asignado:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// DESASIGNAR DE INSTRUCTOR
async function desasignarVehiculo(instructorId, vehicleId) {
  try {
    const respuesta = await vehicleService.desasignarDelInstructor(instructorId, vehicleId);
    console.log("Vehículo desasignado:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
*/

// ============ LICENCIAS ============
/*
import { licenseService } from "@/services";

// OBTENER TODAS
async function cargarLicencias() {
  try {
    const licencias = await licenseService.obtenerTodas();
    console.log("Licencias:", licencias);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// OBTENER PRÓXIMAS A VENCER
async function cargarProximasAVencer() {
  try {
    const licencias = await licenseService.obtenerProximasAVencer();
    console.log("Próximas a vencer:", licencias);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// OBTENER VENCIDAS
async function cargarVencidas() {
  try {
    const licencias = await licenseService.obtenerVencidas();
    console.log("Vencidas:", licencias);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// CREAR
async function crearLicencia() {
  try {
    const respuesta = await licenseService.crear({
      instructorId: 1,
      tipoLicencia: "B",
      numeroLicencia: "LIC001",
      categoria: "Automóviles",
      fechaEmision: "2020-01-15",
      fechaVencimiento: "2030-01-15"
    });
    console.log("Licencia creada:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ACTUALIZAR
async function actualizarLicencia(id) {
  try {
    const respuesta = await licenseService.actualizar(id, {
      fechaVencimiento: "2031-01-15"
    });
    console.log("Licencia actualizada:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ELIMINAR
async function eliminarLicencia(id) {
  try {
    const respuesta = await licenseService.eliminar(id);
    console.log("Licencia eliminada:", respuesta);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
*/

// ============ USUARIOS ============
/*
import { userService } from "@/services";

// OBTENER TODOS
async function cargarUsuarios() {
  try {
    const usuarios = await userService.obtenerTodos();
    console.log("Usuarios:", usuarios);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// OBTENER UNO
async function cargarUsuario(id) {
  try {
    const usuario = await userService.obtenerPorId(id);
    console.log("Usuario:", usuario);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
*/

// ============================================
// VARIABLES DE ENTORNO (en .env.local)
// ============================================
/*
REACT_APP_API_URL=http://localhost:3001/api
*/

// ============================================
// ESTRUCTURA DE ERRORES
// ============================================
/*
Las funciones devuelven promesas. Si hay error:

error.message        - Mensaje del error
error.status         - Código HTTP (401, 404, 500, etc.)
error.datos          - Respuesta completa del servidor

Ejemplo:
try {
  await instructorService.crear(datos);
} catch (error) {
  console.log(error.status);  // 400
  console.log(error.message); // "El RUT ya existe"
  console.log(error.datos);   // { message: "...", details: {...} }
}
*/

export {};
