"use strict";
import {
  createLicenseValidation,
  updateLicenseValidation,
} from "../validations/license.validation.js";
import * as licenseService from "../services/license.service.js";

function resolveLicenseImageValue(req) {
  const bodyValue = req.body?.imagenRuta ?? req.body?.imagen ?? null;

  if (typeof bodyValue === "string" && bodyValue.trim()) {
    return bodyValue.trim();
  }

  const uploadedFile = req.files?.imagen?.[0] || req.files?.imagenRuta?.[0] || req.file;
  if (uploadedFile?.filename) {
    return uploadedFile.filename;
  }

  return null;
}

function normalizeLicensePayload(req) {
  const payload = { ...req.body };

  if (payload.activa !== undefined) {
    if (payload.activa === "true") payload.activa = true;
    else if (payload.activa === "false") payload.activa = false;
  }

  if (payload.fechaEmision && typeof payload.fechaEmision === "string") {
    payload.fechaEmision = new Date(payload.fechaEmision);
  }

  if (payload.fechaVencimiento && typeof payload.fechaVencimiento === "string") {
    payload.fechaVencimiento = new Date(payload.fechaVencimiento);
  }

  return payload;
}

export async function createLicense(req, res) {
  try {
    const normalizedBody = normalizeLicensePayload(req);
    const { error } = createLicenseValidation.validate(normalizedBody);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const imageValue = resolveLicenseImageValue(req);

    const licenseData = {
      ...normalizedBody,
      userId: normalizedBody.userId ?? req.user?.id,
      activa: normalizedBody.activa ?? false,
      imagenRuta: imageValue,
    };

    const newLicense = await licenseService.createLicense(licenseData);

    res
      .status(201)
      .json({
        message: "Licencia creada exitosamente!",
        data: newLicense,
      });
  } catch (error) {
    console.error("Error en license.controller.js -> createLicense(): ", error);
    
    if (error.message.includes("ya existe")) {
      return res.status(409).json({ message: error.message });
    }
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Solo")) {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al crear la licencia" });
  }
}

export async function getLicenses(req, res) {
  try {
    const licenses = await licenseService.getAllLicenses(req.user.role, req.user);

    res.status(200).json({ message: "Licencias encontradas", data: licenses });
  } catch (error) {
    console.error("Error en license.controller.js -> getLicenses(): ", error);
    res.status(500).json({ message: "Error al obtener licencias" });
  }
}

export async function getLicenseById(req, res) {
  try {
    const licenseId = parseInt(req.params.id);

    if (isNaN(licenseId))
      return res.status(400).json({ message: "ID inválido" });

    const license = await licenseService.getLicenseById(licenseId, req.user.role, req.user);

    res.status(200).json({ message: "Licencia encontrada", data: license });
  } catch (error) {
    console.error(
      "Error en license.controller.js -> getLicenseById(): ",
      error
    );
    
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al obtener la licencia" });
  }
}

export async function updateLicense(req, res) {
  try {
    const licenseId = parseInt(req.params.id);
    const normalizedBody = normalizeLicensePayload(req);
    const { error } = updateLicenseValidation.validate(normalizedBody);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (isNaN(licenseId))
      return res.status(400).json({ message: "ID inválido" });

    const imageValue = resolveLicenseImageValue(req);
    const updateData = {
      ...normalizedBody,
      ...(imageValue !== null ? { imagenRuta: imageValue } : {}),
    };

    const updatedLicense = await licenseService.updateLicense(licenseId, updateData);

    res.status(200).json({
      message: "Licencia actualizada correctamente",
      data: updatedLicense,
    });
  } catch (error) {
    console.error(
      "Error en license.controller.js -> updateLicense(): ",
      error
    );
    
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("ya existe")) {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al actualizar la licencia" });
  }
}

export async function deleteLicense(req, res) {
  try {
    const licenseId = parseInt(req.params.id);

    if (isNaN(licenseId))
      return res.status(400).json({ message: "ID inválido" });

    const deletedLicense = await licenseService.deleteLicense(licenseId);

    res
      .status(200)
      .json({ message: "Licencia eliminada correctamente", data: deletedLicense });
  } catch (error) {
    console.error(
      "Error en license.controller.js -> deleteLicense(): ",
      error
    );
    
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al eliminar la licencia" });
  }
}
