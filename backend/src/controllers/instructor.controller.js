"use strict";
import { AppDataSource } from "../config/configDb.js";
import {
  createInstructorValidation,
  updateInstructorValidation,
} from "../validations/instructor.validation.js";

export async function createInstructor(req, res) {
  try {
    const instructorRepository = AppDataSource.getRepository("Instructor");
    const userRepository = AppDataSource.getRepository("Usuario");
    const { error } = createInstructorValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await userRepository.findOne({
      where: { id: req.body.userId },
    });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    if (user.role !== "instructor" && user.role !== "profesor") {
      return res
        .status(403)
        .json({
          message: "El usuario debe tener rol de instructor o profesor.",
        });
    }

    const existingInstructor = await instructorRepository.findOne({
      where: { userId: req.body.userId },
    });
    if (existingInstructor)
      return res
        .status(409)
        .json({ message: "Este usuario ya es instructor." });

    const newInstructor = instructorRepository.create({
      userId: req.body.userId,
      rut: req.body.rut,
      especializacion: req.body.especializacion,
      correo: req.body.correo,
      anosExperiencia: req.body.anosExperiencia || 0,
      telefono: req.body.telefono,
      activo: req.body.activo !== false,
    });
    await instructorRepository.save(newInstructor);

    res
      .status(201)
      .json({
        message: "Instructor creado exitosamente!",
        data: newInstructor,
      });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> createInstructor(): ",
      error
    );
    res.status(500).json({ message: "Error al crear el instructor" });
  }
}

export async function getInstructors(req, res) {
  try {
    const instructorRepository = AppDataSource.getRepository("Instructor");
    const instructors = await instructorRepository.find({
      relations: ["usuario", "licencias", "vehiculos"],
    });

    if (req.user.role === "secretaria") {
      const filteredInstructors = instructors
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
      return res.status(200).json({
        message: "Instructores encontrados",
        data: filteredInstructors,
      });
    }

    res.status(200).json({
      message: "Instructores encontrados",
      data: instructors,
    });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> getInstructors(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener instructores" });
  }
}

export async function getInstructorById(req, res) {
  try {
    const instructorRepository = AppDataSource.getRepository("Instructor");
    const instructorId = parseInt(req.params.id);

    if (isNaN(instructorId))
      return res.status(400).json({ message: "ID inválido" });

    const instructor = await instructorRepository.findOne({
      where: { id: instructorId },
      relations: ["usuario", "licencias", "vehiculos"],
    });

    if (!instructor)
      return res.status(404).json({ message: "Instructor no encontrado." });

    if (req.user.role === "secretaria") {
      const filteredInstructor = {
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
      return res.status(200).json({
        message: "Instructor encontrado",
        data: filteredInstructor,
      });
    }

    res.status(200).json({ message: "Instructor encontrado", data: instructor });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> getInstructorById(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener el instructor" });
  }
}

export async function updateInstructor(req, res) {
  try {
    const instructorRepository = AppDataSource.getRepository("Instructor");
    const instructorId = parseInt(req.params.id);
    const { error } = updateInstructorValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (isNaN(instructorId))
      return res.status(400).json({ message: "ID inválido" });

    const instructor = await instructorRepository.findOne({
      where: { id: instructorId },
    });

    if (!instructor)
      return res.status(404).json({ message: "Instructor no encontrado." });

    const updatedInstructor = {
      ...instructor,
      ...req.body,
    };
    await instructorRepository.save(updatedInstructor);

    res.status(200).json({
      message: "Instructor actualizado correctamente",
      data: updatedInstructor,
    });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> updateInstructor(): ",
      error
    );
    res.status(500).json({ message: "Error al actualizar el instructor" });
  }
}

export async function deleteInstructor(req, res) {
  try {
    const instructorRepository = AppDataSource.getRepository("Instructor");
    const instructorId = parseInt(req.params.id);

    if (isNaN(instructorId))
      return res.status(400).json({ message: "ID inválido" });

    const instructor = await instructorRepository.findOne({
      where: { id: instructorId },
    });

    if (!instructor)
      return res.status(404).json({ message: "Instructor no encontrado." });

    await instructorRepository.remove(instructor);

    res.status(200).json({
      message: "Instructor eliminado correctamente",
      data: instructor,
    });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> deleteInstructor(): ",
      error
    );
    res.status(500).json({ message: "Error al eliminar el instructor" });
  }
}
