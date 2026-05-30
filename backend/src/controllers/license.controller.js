"use strict";
import {
  createLicenseValidation,
  updateLicenseValidation,
} from "../validations/license.validation.js";
import * as licenseService from "../services/license.service.js";

export async function createLicense(req, res) {
  try {
    const { error } = createLicenseValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newLicense = await licenseService.createLicense(req.body);

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
    const licenses = await licenseService.getAllLicenses(req.user.role);

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

    const license = await licenseService.getLicenseById(licenseId, req.user.role);

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
    const { error } = updateLicenseValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (isNaN(licenseId))
      return res.status(400).json({ message: "ID inválido" });

    const updatedLicense = await licenseService.updateLicense(licenseId, req.body);

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
