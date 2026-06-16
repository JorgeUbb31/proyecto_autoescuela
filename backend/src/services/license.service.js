"use strict";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crea una nueva licencia
 */
export async function createLicense(licenseData) {
  const licenseRepository = AppDataSource.getRepository("Licencia");
  const instructorRepository = AppDataSource.getRepository("Instructor");

  // Verificar que no exista una licencia con ese número
  const existingLicense = await licenseRepository.findOne({
    where: { numeroLicencia: licenseData.numeroLicencia },
  });

  if (existingLicense) {
    throw new Error("Esta licencia ya existe.");
  }

  // Verificar que el instructor existe y tiene rol válido
  const instructor = await instructorRepository.findOne({
    where: { id: licenseData.instructorId },
    relations: ["usuario"],
  });

  if (!instructor) {
    throw new Error("Instructor no encontrado.");
  }

  if (
    instructor.usuario.role !== "instructor" &&
    instructor.usuario.role !== "profesor"
  ) {
    throw new Error(
      "Solo instructores o profesores pueden tener licencias asociadas."
    );
  }

  const newLicense = licenseRepository.create({
    instructorId: licenseData.instructorId,
    tipoLicencia: licenseData.tipoLicencia,
    numeroLicencia: licenseData.numeroLicencia,
    categoria: licenseData.categoria,
    fechaEmision: licenseData.fechaEmision,
    fechaVencimiento: licenseData.fechaVencimiento,
    activa: licenseData.activa,
  });

  await licenseRepository.save(newLicense);

  return newLicense;
}

/**
 * Obtiene todas las licencias con filtrado según rol del usuario
 */
export async function getAllLicenses(userRole = null) {
  const licenseRepository = AppDataSource.getRepository("Licencia");
  const licenses = await licenseRepository.find({
    relations: ["instructor"],
  });

  // Si el usuario es secretaria, filtrar información sensible
  if (userRole === "secretaria") {
    return licenses.map((license) => ({
      id: license.id,
      tipoLicencia: license.tipoLicencia,
      categoria: license.categoria,
      fechaVencimiento: license.fechaVencimiento,
      activa: license.activa,
      instructor: {
        id: license.instructor?.id,
        especializacion: license.instructor?.especializacion,
      },
    }));
  }

  return licenses;
}

/**
 * Obtiene una licencia por su ID con filtrado según rol del usuario
 */
export async function getLicenseById(licenseId, userRole = null) {
  const licenseRepository = AppDataSource.getRepository("Licencia");

  const license = await licenseRepository.findOne({
    where: { id: licenseId },
    relations: ["instructor"],
  });

  if (!license) {
    throw new Error("Licencia no encontrada.");
  }

  // Si el usuario es secretaria, filtrar información
  if (userRole === "secretaria") {
    return {
      id: license.id,
      tipoLicencia: license.tipoLicencia,
      categoria: license.categoria,
      fechaVencimiento: license.fechaVencimiento,
      activa: license.activa,
      instructor: {
        id: license.instructor?.id,
        especializacion: license.instructor?.especializacion,
      },
    };
  }

  return license;
}

/**
 * Actualiza una licencia
 */
export async function updateLicense(licenseId, updateData) {
  const licenseRepository = AppDataSource.getRepository("Licencia");

  const license = await licenseRepository.findOne({
    where: { id: licenseId },
  });

  if (!license) {
    throw new Error("Licencia no encontrada.");
  }

  // Validar que el número de licencia no esté duplicado
  if (
    updateData.numeroLicencia &&
    updateData.numeroLicencia !== license.numeroLicencia
  ) {
    const existingLicense = await licenseRepository.findOne({
      where: { numeroLicencia: updateData.numeroLicencia },
    });
    if (existingLicense) {
      throw new Error("Este número de licencia ya existe.");
    }
  }

  const updatedLicense = {
    ...license,
    ...updateData,
  };

  await licenseRepository.save(updatedLicense);

  return updatedLicense;
}

/**
 * Elimina una licencia
 */
export async function deleteLicense(licenseId) {
  const licenseRepository = AppDataSource.getRepository("Licencia");

  const license = await licenseRepository.findOne({
    where: { id: licenseId },
  });

  if (!license) {
    throw new Error("Licencia no encontrada.");
  }

  await licenseRepository.remove(license);

  return license;
}
