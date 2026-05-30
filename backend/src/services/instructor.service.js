"use strict";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crea un nuevo instructor
 */
export async function createInstructor(instructorData) {
  const instructorRepository = AppDataSource.getRepository("Instructor");
  const userRepository = AppDataSource.getRepository("Usuario");

  const user = await userRepository.findOne({
    where: { id: instructorData.userId },
  });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  if (user.role !== "instructor" && user.role !== "profesor") {
    throw new Error("El usuario debe tener rol de instructor o profesor.");
  }

  const existingInstructor = await instructorRepository.findOne({
    where: { userId: instructorData.userId },
  });

  if (existingInstructor) {
    throw new Error("Este usuario ya es instructor.");
  }

  const newInstructor = instructorRepository.create({
    userId: instructorData.userId,
    rut: instructorData.rut,
    especializacion: instructorData.especializacion,
    correo: instructorData.correo,
    anosExperiencia: instructorData.anosExperiencia || 0,
    telefono: instructorData.telefono,
    activo: instructorData.activo !== false,
  });

  await instructorRepository.save(newInstructor);

  return newInstructor;
}

/**
 * Obtiene todos los instructores con filtrado según rol del usuario
 */
export async function getAllInstructors(userRole = null) {
  const instructorRepository = AppDataSource.getRepository("Instructor");
  const instructors = await instructorRepository.find({
    relations: ["usuario", "licencias", "vehiculos"],
  });

  // Si el usuario es secretaria, filtrar información
  if (userRole === "secretaria") {
    return instructors
      .filter((i) => i.activo)
      .map((instructor) => ({
        id: instructor.id,
        nombre: instructor.usuario?.username,
        especializacion: instructor.especializacion,
        licencias: instructor.licencias.map((l) => ({
          tipoLicencia: l.tipoLicencia,
          fechaVencimiento: l.fechaVencimiento,
          activa: l.activa,
        })),
        vehiculosAsignados: instructor.vehiculos.map((v) => ({
          id: v.id,
          matricula: v.matricula,
          marca: v.marca,
          modelo: v.modelo,
        })),
      }));
  }

  return instructors;
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

  // Si el usuario es secretaria, filtrar información
  if (userRole === "secretaria") {
    return {
      id: instructor.id,
      nombre: instructor.usuario?.username,
      especializacion: instructor.especializacion,
      licencias: instructor.licencias.map((l) => ({
        tipoLicencia: l.tipoLicencia,
        fechaVencimiento: l.fechaVencimiento,
        activa: l.activa,
      })),
      vehiculosAsignados: instructor.vehiculos.map((v) => ({
        id: v.id,
        matricula: v.matricula,
        marca: v.marca,
        modelo: v.modelo,
      })),
    };
  }

  return instructor;
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

  const updatedInstructor = {
    ...instructor,
    ...updateData,
  };

  await instructorRepository.save(updatedInstructor);

  return updatedInstructor;
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

  return instructor;
}
