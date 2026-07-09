"use strict";
import { AppDataSource } from "../config/configDb.js";
import { mapLicense, mapLicenses } from "../helpers/response.mapper.js";
import { sendLicenseExpirationReminderNotification } from "../helpers/email.helper.js";

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

export async function getLicenseSummary() {
  const licenseRepository = AppDataSource.getRepository("Licencia");
  const licenses = await licenseRepository.find({
    relations: ["instructor", "instructor.usuario"],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const summary = licenses.reduce(
    (acc, license) => {
      const expiration = license.fechaVencimiento ? new Date(license.fechaVencimiento) : null;
      if (!expiration) return acc;

      expiration.setHours(0, 0, 0, 0);
      const daysRemaining = getDaysUntilExpiration(license.fechaVencimiento);
      const isExpired = expiration < today;
      const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30;
      const needsReminder = isExpiringSoon && !license.reminderSentAt;

      acc.totalLicenses += 1;
      if (license.activa) acc.activeLicenses += 1;
      if (isExpired) acc.expiredLicenses += 1;
      if (isExpiringSoon) acc.expiringSoonLicenses += 1;
      if (needsReminder) acc.pendingReminders += 1;
      return acc;
    },
    {
      totalLicenses: 0,
      activeLicenses: 0,
      expiredLicenses: 0,
      expiringSoonLicenses: 0,
      pendingReminders: 0,
    }
  );

  return summary;
}

function getDaysUntilExpiration(expirationDate) {
  if (!expirationDate) return null;
  const today = new Date();
  const expire = new Date(expirationDate);
  const diffMs = expire.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export async function sendLicenseExpirationReminders(daysThreshold = 30) {
  const licenseRepository = AppDataSource.getRepository("Licencia");
  const licenses = await licenseRepository.find({
    relations: ["instructor", "instructor.usuario"],
  });

  const today = new Date();
  const expiringSoon = licenses.filter((license) => {
    if (!license.activa || !license.fechaVencimiento) return false;
    const remainingDays = getDaysUntilExpiration(license.fechaVencimiento);
    if (remainingDays === null) return false;
    return remainingDays > 0 && remainingDays <= daysThreshold && !license.reminderSentAt;
  });

  for (const license of expiringSoon) {
    try {
      const assignedInstructor = license.instructor;
      const recipientEmail = assignedInstructor?.correo || assignedInstructor?.usuario?.email;
      const instructorName = assignedInstructor?.usuario?.username || assignedInstructor?.correo || 'Instructor';
      const daysUntilExpiration = getDaysUntilExpiration(license.fechaVencimiento);

      if (!recipientEmail) {
        console.info(`[reminder] No hay correo para instructor de licencia ${license.numeroLicencia}`);
        continue;
      }

      await sendLicenseExpirationReminderNotification({
        to: recipientEmail,
        instructorName,
        licenceNumber: license.numeroLicencia,
        expiryDate: license.fechaVencimiento instanceof Date
          ? license.fechaVencimiento.toISOString().split('T')[0]
          : license.fechaVencimiento,
        daysRemaining: daysUntilExpiration,
      });

      license.reminderSentAt = new Date();
      await licenseRepository.save(license);
      console.log(`[reminder] Recordatorio enviado para licencia ${license.numeroLicencia} a ${recipientEmail}`);
    } catch (error) {
      console.error(`Error enviando recordatorio para licencia ${license.numeroLicencia}:`, error);
    }
  }
}
