"use strict";
import { AppDataSource } from "../config/configDb.js";
import {
  createLicenseValidation,
  updateLicenseValidation,
} from "../validations/license.validation.js";

const LicenseEntity = (await import("../entity/license.entity.js")).default;

export async function createLicense(req, res) {
  try {
    const licenseRepository = AppDataSource.getRepository("Licencia");
    const { error } = createLicenseValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingLicense = await licenseRepository.findOne({
      where: { numeroLicencia: req.body.numeroLicencia },
    });
    if (existingLicense)
      return res.status(409).json({ message: "Esta licencia ya existe." });

    const instructorRepository = AppDataSource.getRepository("Instructor");
    const instructor = await instructorRepository.findOne({
      where: { id: req.body.instructorId },
      relations: ["usuario"],
    });
    if (!instructor)
      return res.status(404).json({ message: "Instructor no encontrado." });

    if (
      instructor.usuario.role !== "instructor" &&
      instructor.usuario.role !== "profesor"
    ) {
      return res
        .status(403)
        .json({
          message:
            "Solo instructores o profesores pueden tener licencias asociadas.",
        });
    }

    const newLicense = licenseRepository.create({
      instructorId: req.body.instructorId,
      tipoLicencia: req.body.tipoLicencia,
      numeroLicencia: req.body.numeroLicencia,
      categoria: req.body.categoria,
      fechaEmision: req.body.fechaEmision,
      fechaVencimiento: req.body.fechaVencimiento,
      activa: req.body.activa,
    });
    await licenseRepository.save(newLicense);

    res
      .status(201)
      .json({
        message: "Licencia creada exitosamente!",
        data: newLicense,
      });
  } catch (error) {
    console.error("Error en license.controller.js -> createLicense(): ", error);
    res.status(500).json({ message: "Error al crear la licencia" });
  }
}

export async function getLicenses(req, res) {
  try {
    const licenseRepository = AppDataSource.getRepository("Licencia");
    const licenses = await licenseRepository.find({
      relations: ["instructor"],
    });

    if (req.user.role === "secretaria") {
      const filteredLicenses = licenses.map((license) => ({
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
      return res.status(200).json({
        message: "Licencias encontradas",
        data: filteredLicenses,
      });
    }

    res.status(200).json({ message: "Licencias encontradas", data: licenses });
  } catch (error) {
    console.error("Error en license.controller.js -> getLicenses(): ", error);
    res.status(500).json({ message: "Error al obtener licencias" });
  }
}

export async function getLicenseById(req, res) {
  try {
    const licenseRepository = AppDataSource.getRepository("Licencia");
    const licenseId = parseInt(req.params.id);

    if (isNaN(licenseId))
      return res.status(400).json({ message: "ID inválido" });

    const license = await licenseRepository.findOne({
      where: { id: licenseId },
      relations: ["instructor"],
    });

    if (!license)
      return res.status(404).json({ message: "Licencia no encontrada." });

    if (req.user.role === "secretaria") {
      const filteredLicense = {
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
      return res.status(200).json({
        message: "Licencia encontrada",
        data: filteredLicense,
      });
    }

    res.status(200).json({ message: "Licencia encontrada", data: license });
  } catch (error) {
    console.error(
      "Error en license.controller.js -> getLicenseById(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener la licencia" });
  }
}

export async function updateLicense(req, res) {
  try {
    const licenseRepository = AppDataSource.getRepository("Licencia");
    const licenseId = parseInt(req.params.id);
    const { error } = updateLicenseValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (isNaN(licenseId))
      return res.status(400).json({ message: "ID inválido" });

    const license = await licenseRepository.findOne({
      where: { id: licenseId },
    });

    if (!license)
      return res.status(404).json({ message: "Licencia no encontrada." });

    if (req.body.numeroLicencia && req.body.numeroLicencia !== license.numeroLicencia) {
      const existingLicense = await licenseRepository.findOne({
        where: { numeroLicencia: req.body.numeroLicencia },
      });
      if (existingLicense)
        return res
          .status(409)
          .json({ message: "Este número de licencia ya existe." });
    }

    const updatedLicense = {
      ...license,
      ...req.body,
    };
    await licenseRepository.save(updatedLicense);

    res.status(200).json({
      message: "Licencia actualizada correctamente",
      data: updatedLicense,
    });
  } catch (error) {
    console.error(
      "Error en license.controller.js -> updateLicense(): ",
      error
    );
    res.status(500).json({ message: "Error al actualizar la licencia" });
  }
}

export async function deleteLicense(req, res) {
  try {
    const licenseRepository = AppDataSource.getRepository("Licencia");
    const licenseId = parseInt(req.params.id);

    if (isNaN(licenseId))
      return res.status(400).json({ message: "ID inválido" });

    const license = await licenseRepository.findOne({
      where: { id: licenseId },
    });

    if (!license)
      return res.status(404).json({ message: "Licencia no encontrada." });

    await licenseRepository.remove(license);

    res
      .status(200)
      .json({ message: "Licencia eliminada correctamente", data: license });
  } catch (error) {
    console.error(
      "Error en license.controller.js -> deleteLicense(): ",
      error
    );
    res.status(500).json({ message: "Error al eliminar la licencia" });
  }
}
