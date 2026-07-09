"use strict";

function toDateString(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    const normalized = value.split("T")[0];
    return normalized || null;
  }

  return value;
}

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    rut: user.rut,
    role: user.role,
  };
}

export function mapUser(user) {
  if (!user) return null;
  return toPublicUser(user);
}

export function mapUsers(users = []) {
  return users.map(mapUser);
}

export function mapInstructor(instructor, userRole = null) {
  if (!instructor) return null;

  const instructorDto = {
    id: instructor.id,
    userId: instructor.userId ?? instructor.usuario?.id ?? null,
    rut: instructor.rut,
    especializacion: instructor.especializacion,
    correo: instructor.correo,
    anosExperiencia: instructor.anosExperiencia ?? 0,
    anos_experiencia: instructor.anosExperiencia ?? 0,
    telefono: instructor.telefono,
    activo: instructor.activo,
    nombre: instructor.usuario?.username ?? null,
    usuario: instructor.usuario
      ? {
          id: instructor.usuario.id,
          username: instructor.usuario.username,
          email: instructor.usuario.email,
          rut: instructor.usuario.rut,
          role: instructor.usuario.role,
        }
      : null,
  };

  if (userRole === "secretaria") {
    return {
      id: instructorDto.id,
      nombre: instructorDto.nombre,
      especializacion: instructorDto.especializacion,
      anosExperiencia: instructorDto.anosExperiencia,
      activo: instructorDto.activo,
      licencias: (instructor.licencias || []).map((license) => ({
        id: license.id,
        tipoLicencia: license.tipoLicencia,
        tipo_licencia: license.tipoLicencia,
        fechaVencimiento: toDateString(license.fechaVencimiento),
        fecha_vencimiento: toDateString(license.fechaVencimiento),
        activa: license.activa,
      })),
      vehiculosAsignados: (instructor.vehiculos || []).map((vehicle) => ({
        id: vehicle.id,
        matricula: vehicle.matricula,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
      })),
    };
  }

  return instructorDto;
}

export function mapInstructors(instructors = [], userRole = null) {
  return instructors.map((instructor) => mapInstructor(instructor, userRole));
}

export function mapVehicle(vehicle, userRole = null) {
  if (!vehicle) return null;

  const vehicleDto = {
    id: vehicle.id,
    matricula: vehicle.matricula,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    ano: vehicle.ano,
    tipo: vehicle.tipo,
    transmision: vehicle.transmision,
    vencimientoPatente: toDateString(vehicle.vencimientoPatente),
    vencimiento_patente: toDateString(vehicle.vencimientoPatente),
    vencimientoRevisionTecnica: toDateString(vehicle.vencimientoRevisionTecnica),
    vencimiento_revision_tecnica: toDateString(vehicle.vencimientoRevisionTecnica),
    disponible: vehicle.disponible,
    requiereMantenimiento: vehicle.requiereMantenimiento ?? false,
    comentarioMantenimiento: vehicle.comentarioMantenimiento ?? null,
    nivelVencina: vehicle.nivelVencina ?? null,
    enMantenimiento: vehicle.enMantenimiento ?? false,
    estadoMantenimiento: vehicle.enMantenimiento
      ? "En mantenimiento"
      : vehicle.requiereMantenimiento
        ? "Pendiente de revisión"
        : "Sin reporte",
    instructores: (vehicle.instructores || []).map((instructor) => ({
      id: instructor.id,
      rut: instructor.rut,
      nombre: instructor.usuario?.username ?? null,
    })),
  };

  if (userRole === "secretaria") {
    return {
      id: vehicleDto.id,
      matricula: vehicleDto.matricula,
      marca: vehicleDto.marca,
      modelo: vehicleDto.modelo,
      ano: vehicleDto.ano,
      tipo: vehicleDto.tipo,
      transmision: vehicleDto.transmision,
      disponible: vehicleDto.disponible,
      requiereMantenimiento: vehicleDto.requiereMantenimiento,
      comentarioMantenimiento: vehicleDto.comentarioMantenimiento,
      nivelVencina: vehicleDto.nivelVencina,
      enMantenimiento: vehicleDto.enMantenimiento,
      estadoMantenimiento: vehicleDto.estadoMantenimiento,
      instructoresAsignados: vehicleDto.instructores.map((instructor) => instructor.id),
    };
  }

  return vehicleDto;
}

export function mapVehicles(vehicles = [], userRole = null) {
  return vehicles.map((vehicle) => mapVehicle(vehicle, userRole));
}

export function mapLicense(license, userRole = null) {
  if (!license) return null;

  const licenseDto = {
    id: license.id,
    instructorId: license.instructorId,
    instructor_id: license.instructorId,
    tipoLicencia: license.tipoLicencia,
    tipo_licencia: license.tipoLicencia,
    numeroLicencia: license.numeroLicencia,
    numero_licencia: license.numeroLicencia,
    categoria: license.categoria,
    fechaEmision: toDateString(license.fechaEmision),
    fecha_emision: toDateString(license.fechaEmision),
    fechaVencimiento: toDateString(license.fechaVencimiento),
    fecha_vencimiento: toDateString(license.fechaVencimiento),
    activa: license.activa,
    imagenRuta: license.imagenRuta,
    imagen_ruta: license.imagenRuta,
    reminderSentAt: toDateString(license.reminderSentAt),
    reminder_sent_at: toDateString(license.reminderSentAt),
    instructor: license.instructor
      ? {
          id: license.instructor.id,
          rut: license.instructor.rut,
          especializacion: license.instructor.especializacion,
        }
      : null,
  };

  if (userRole === "secretaria") {
    return {
      id: licenseDto.id,
      tipoLicencia: licenseDto.tipoLicencia,
      tipo_licencia: licenseDto.tipo_licencia,
      categoria: licenseDto.categoria,
      fechaVencimiento: licenseDto.fechaVencimiento,
      fecha_vencimiento: licenseDto.fecha_vencimiento,
      activa: licenseDto.activa,
      instructor: licenseDto.instructor,
    };
  }

  return licenseDto;
}

export function mapLicenses(licenses = [], userRole = null) {
  return licenses.map((license) => mapLicense(license, userRole));
}
