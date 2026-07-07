"use strict";
import { AppDataSource } from "../config/configDb.js";
import { mapLicense, mapLicenses } from "./response.mapper.js";

/**
 * Crea una nueva licencia
 */
export async function createLicense(licenseData) {
  const licenseRepository = AppDataSource.getRepository("Licencia");
  const instructorRepository = AppDataSource.getRepository("Instructor");
  const userRepository = AppDataSource.getRepository("User");

  // Verificar que no exista una licencia con ese número
  const existingLicense = await licenseRepository.findOne({
    where: { numeroLicencia: licenseData.numeroLicencia },
  });

  if (existingLicense) {
    throw new Error("Esta licencia ya existe.");
  }

  let instructor = null;
  if (licenseData.instructorId) {
    instructor = await instructorRepository.findOne({
      where: { id: licenseData.instructorId },
      relations: ["usuario"],
    });
  }

  let user = null;
  if (licenseData.userId) {
    user = await userRepository.findOne({ where: { id: licenseData.userId } });
  }

  if (!instructor && licenseData.userId && user) {
    instructor = await instructorRepository.findOne({
      where: { usuario: { id: user.id } },
      relations: ["usuario"],
    });
  }

  if (!instructor && licenseData.userId && user) {
    const pendingInstructor = instructorRepository.create({
      usuario: user,
      rut: licenseData.rut || user.rut,
      especializacion: licenseData.especializacion || "Licencia presentada",
      correo: user.email,
      anosExperiencia: 0,
      activo: true,
    });

    await instructorRepository.save(pendingInstructor);
    instructor = pendingInstructor;
  }

  if (!instructor) {
    throw new Error("Instructor no encontrado.");
  }

  if (!user) {
    user = await userRepository.findOne({ where: { id: instructor.userId } });
  }

  if (!user || !["instructor", "profesor", "usuario"].includes(user.role)) {
    throw new Error("Solo usuarios, instructores o profesores pueden enviar licencias para revisión.");
  }

  if (!instructor) {
    throw new Error("No se pudo encontrar o crear un instructor asociado al usuario.");
  }

  const newLicense = licenseRepository.create({
    instructorId: instructor.id,
    tipoLicencia: licenseData.tipoLicencia,
    numeroLicencia: licenseData.numeroLicencia,
    categoria: licenseData.categoria,
    fechaEmision: licenseData.fechaEmision,
    fechaVencimiento: licenseData.fechaVencimiento,
    activa: licenseData.activa ?? false,
    imagenRuta: licenseData.imagenRuta || null,
  });

  await licenseRepository.save(newLicense);

  return mapLicense(newLicense);
}

/**
 * Obtiene todas las licencias con filtrado según rol del usuario
 */
export async function getAllLicenses(userRole = null, currentUser = null) {
  const licenseRepository = AppDataSource.getRepository("Licencia");
  const licenses = await licenseRepository.find({
    relations: ["instructor", "instructor.usuario"],
  });

  const visibleLicenses = currentUser?.role?.toLowerCase() === "usuario"
    ? licenses.filter((license) => license.instructor?.userId === currentUser.id || license.instructor?.usuario?.id === currentUser.id)
    : licenses;

  return mapLicenses(visibleLicenses, userRole);
}

/**
 * Obtiene una licencia por su ID con filtrado según rol del usuario
 */
export async function getLicenseById(licenseId, userRole = null, currentUser = null) {
  const licenseRepository = AppDataSource.getRepository("Licencia");

  const license = await licenseRepository.findOne({
    where: { id: licenseId },
    relations: ["instructor", "instructor.usuario"],
  });

  if (!license) {
    throw new Error("Licencia no encontrada.");
  }

  if (currentUser?.role?.toLowerCase() === "usuario") {
    const isOwner = license.instructor?.userId === currentUser.id || license.instructor?.usuario?.id === currentUser.id;
    if (!isOwner) {
      throw new Error("Licencia no encontrada.");
    }
  }

  return mapLicense(license, userRole);
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

  return mapLicense(updatedLicense);
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

  return mapLicense(license);
}
