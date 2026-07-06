"use strict";
import { AppDataSource } from "../config/configDb.js";
import { mapInstructor, mapInstructors } from "./response.mapper.js";

/**
 * Crea un nuevo instructor
 */
export async function createInstructor(instructorData) {
  const instructorRepository = AppDataSource.getRepository("Instructor");
  const userRepository = AppDataSource.getRepository("Usuario");
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");
  const licenseRepository = AppDataSource.getRepository("Licencia");

  const user = await userRepository.findOne({
    where: { id: instructorData.userId },
  });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  if (user.role !== "instructor" && user.role !== "profesor") {
    throw new Error("El usuario debe tener rol de profesor o instructor.");
  }

  const existingInstructor = await instructorRepository.findOne({
    where: { userId: instructorData.userId },
  });

  if (existingInstructor) {
    throw new Error("Este usuario ya es instructor.");
  }

  const availableVehicles = await vehicleRepository.count({ where: { disponible: true, enMantenimiento: false } });
  if (user.role === "profesor" && availableVehicles <= 0) {
    throw new Error("No hay vehículos disponibles para promover a un profesor a instructor.");
  }

  const activeLicenses = await licenseRepository.count({
    where: { activa: true },
    relations: ["instructor"],
  });

  const hasActiveLicense = activeLicenses > 0 && (await licenseRepository.find({
    where: { activa: true },
    relations: ["instructor"],
  })).some((license) => license.instructor?.userId === instructorData.userId || license.instructor?.usuario?.id === instructorData.userId);

  if (user.role === "profesor" && !hasActiveLicense) {
    throw new Error("El profesor debe tener una licencia activa registrada antes de convertirse en instructor.");
  }

  if (user.role === "profesor") {
    user.role = "instructor";
    await userRepository.save(user);
  }

  let instructorRecord = existingInstructor;
  if (!instructorRecord) {
    instructorRecord = instructorRepository.create({
      userId: instructorData.userId,
      rut: instructorData.rut,
      especializacion: instructorData.especializacion,
      correo: instructorData.correo,
      anosExperiencia: instructorData.anosExperiencia || 0,
      telefono: instructorData.telefono,
      activo: instructorData.activo !== false,
    });
    await instructorRepository.save(instructorRecord);
  } else {
    instructorRecord.rut = instructorData.rut || instructorRecord.rut;
    instructorRecord.especializacion = instructorData.especializacion || instructorRecord.especializacion;
    instructorRecord.correo = instructorData.correo || instructorRecord.correo;
    instructorRecord.anosExperiencia = instructorData.anosExperiencia || instructorRecord.anosExperiencia;
    instructorRecord.telefono = instructorData.telefono || instructorRecord.telefono;
    instructorRecord.activo = instructorData.activo !== false;
    await instructorRepository.save(instructorRecord);
  }

  return mapInstructor(instructorRecord);
}

/**
 * Obtiene todos los instructores con filtrado según rol del usuario
 */
export async function getAllInstructors(userRole = null) {
  const instructorRepository = AppDataSource.getRepository("Instructor");
  const instructors = await instructorRepository.find({
    relations: ["usuario", "licencias", "vehiculos"],
  });

  const mappedInstructors = mapInstructors(
    instructors.filter((instructor) => (userRole === "secretaria" ? instructor.activo : true)),
    userRole
  );

  return mappedInstructors;
}

/**
 * Obtiene un instructor por su ID con filtrado según rol del usuario
 */
export async function getInstructorById(instructorId, userRole = null) {
  const instructorRepository = AppDataSource.getRepository("Instructor");

  const instructor = await instructorRepository.findOne({
    where: { id: instructorId },
    relations: ["usuario", "licencias", "vehiculos"],
  });

  if (!instructor) {
    throw new Error("Instructor no encontrado.");
  }

  return mapInstructor(instructor, userRole);
}

/**
 * Actualiza un instructor
 */
export async function updateInstructor(instructorId, updateData) {
  const instructorRepository = AppDataSource.getRepository("Instructor");

  const instructor = await instructorRepository.findOne({
    where: { id: instructorId },
  });

  if (!instructor) {
    throw new Error("Instructor no encontrado.");
  }

  // Si se intenta cambiar el RUT, validar que sea único
  if (updateData.rut && updateData.rut !== instructor.rut) {
    const existingRut = await instructorRepository.findOne({
      where: { rut: updateData.rut },
    });
    if (existingRut) {
      throw new Error("El RUT ya está registrado.");
    }
  }

  const updatedInstructor = {
    ...instructor,
    ...updateData,
  };

  await instructorRepository.save(updatedInstructor);

  return mapInstructor(updatedInstructor);
}

/**
 * Elimina un instructor
 */
export async function deleteInstructor(instructorId) {
  const instructorRepository = AppDataSource.getRepository("Instructor");

  const instructor = await instructorRepository.findOne({
    where: { id: instructorId },
  });

  if (!instructor) {
    throw new Error("Instructor no encontrado.");
  }

  await instructorRepository.remove(instructor);

  return mapInstructor(instructor);
}
