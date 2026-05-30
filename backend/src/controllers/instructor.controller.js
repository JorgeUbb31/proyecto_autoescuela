"use strict";
import {
  createInstructorValidation,
  updateInstructorValidation,
} from "../validations/instructor.validation.js";
import * as instructorService from "../services/instructor.service.js";

export async function createInstructor(req, res) {
  try {
    const { error } = createInstructorValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newInstructor = await instructorService.createInstructor(req.body);

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
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("debe tener rol")) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes("ya es")) {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al crear el instructor" });
  }
}

export async function getInstructors(req, res) {
  try {
    const instructors = await instructorService.getAllInstructors(req.user.role);

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
    const instructorId = parseInt(req.params.id);

    if (isNaN(instructorId))
      return res.status(400).json({ message: "ID inválido" });

    const instructor = await instructorService.getInstructorById(instructorId, req.user.role);

    res.status(200).json({ message: "Instructor encontrado", data: instructor });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> getInstructorById(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al obtener el instructor" });
  }
}

export async function updateInstructor(req, res) {
  try {
    const instructorId = parseInt(req.params.id);
    const { error } = updateInstructorValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (isNaN(instructorId))
      return res.status(400).json({ message: "ID inválido" });

    const updatedInstructor = await instructorService.updateInstructor(instructorId, req.body);

    res.status(200).json({
      message: "Instructor actualizado correctamente",
      data: updatedInstructor,
    });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> updateInstructor(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al actualizar el instructor" });
  }
}

export async function deleteInstructor(req, res) {
  try {
    const instructorId = parseInt(req.params.id);

    if (isNaN(instructorId))
      return res.status(400).json({ message: "ID inválido" });

    const deletedInstructor = await instructorService.deleteInstructor(instructorId);

    res.status(200).json({
      message: "Instructor eliminado correctamente",
      data: deletedInstructor,
    });
  } catch (error) {
    console.error(
      "Error en instructor.controller.js -> deleteInstructor(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al eliminar el instructor" });
  }
}
