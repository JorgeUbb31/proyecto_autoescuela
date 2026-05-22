"use strict";
import { AppDataSource } from "../config/configDb.js";
import {
  createVehicleValidation,
  updateVehicleValidation,
} from "../validations/vehicle.validation.js";

export async function createVehicle(req, res) {
  try {
    const vehicleRepository = AppDataSource.getRepository("Vehiculo");
    const { error } = createVehicleValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingVehicle = await vehicleRepository.findOne({
      where: { matricula: req.body.matricula },
    });
    if (existingVehicle)
      return res
        .status(409)
        .json({ message: "Un vehículo con esta matrícula ya existe." });

    const newVehicle = vehicleRepository.create({
      matricula: req.body.matricula,
      marca: req.body.marca,
      modelo: req.body.modelo,
      ano: req.body.ano,
      tipo: req.body.tipo,
      transmision: req.body.transmision,
      vencimientoPatente: req.body.vencimientoPatente,
      vencimientoRevisionTecnica: req.body.vencimientoRevisionTecnica,
      disponible: req.body.disponible !== false,
    });
    await vehicleRepository.save(newVehicle);

    res
      .status(201)
      .json({
        message: "Vehículo creado exitosamente!",
        data: newVehicle,
      });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> createVehicle(): ",
      error
    );
    res.status(500).json({ message: "Error al crear el vehículo" });
  }
}

export async function getVehicles(req, res) {
  try {
    const vehicleRepository = AppDataSource.getRepository("Vehiculo");
    const vehicles = await vehicleRepository.find({
      relations: ["instructores"],
    });

    if (req.user.role === "secretaria") {
      const availableVehicles = vehicles.filter((v) => v.disponible);
      return res.status(200).json({
        message: "Vehículos encontrados",
        data: availableVehicles.map((v) => ({
          id: v.id,
          matricula: v.matricula,
          marca: v.marca,
          modelo: v.modelo,
          ano: v.ano,
          tipo: v.tipo,
          transmision: v.transmision,
          disponible: v.disponible,
          instructoresAsignados: v.instructores.map((i) => i.id),
        })),
      });
    }

    res.status(200).json({ message: "Vehículos encontrados", data: vehicles });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> getVehicles(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener vehículos" });
  }
}

export async function getVehicleById(req, res) {
  try {
    const vehicleRepository = AppDataSource.getRepository("Vehiculo");
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId))
      return res.status(400).json({ message: "ID inválido" });

    const vehicle = await vehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ["instructores"],
    });

    if (!vehicle)
      return res.status(404).json({ message: "Vehículo no encontrado." });

    res.status(200).json({ message: "Vehículo encontrado", data: vehicle });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> getVehicleById(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener el vehículo" });
  }
}

export async function updateVehicle(req, res) {
  try {
    const vehicleRepository = AppDataSource.getRepository("Vehiculo");
    const vehicleId = parseInt(req.params.id);
    const { error } = updateVehicleValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (isNaN(vehicleId))
      return res.status(400).json({ message: "ID inválido" });

    const vehicle = await vehicleRepository.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle)
      return res.status(404).json({ message: "Vehículo no encontrado." });

    if (req.body.matricula && req.body.matricula !== vehicle.matricula) {
      const existingVehicle = await vehicleRepository.findOne({
        where: { matricula: req.body.matricula },
      });
      if (existingVehicle)
        return res
          .status(409)
          .json({ message: "Un vehículo con esta matrícula ya existe." });
    }

    const updatedVehicle = {
      ...vehicle,
      ...req.body,
    };
    await vehicleRepository.save(updatedVehicle);

    res.status(200).json({
      message: "Vehículo actualizado correctamente",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> updateVehicle(): ",
      error
    );
    res.status(500).json({ message: "Error al actualizar el vehículo" });
  }
}

export async function deleteVehicle(req, res) {
  try {
    const vehicleRepository = AppDataSource.getRepository("Vehiculo");
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId))
      return res.status(400).json({ message: "ID inválido" });

    const vehicle = await vehicleRepository.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle)
      return res.status(404).json({ message: "Vehículo no encontrado." });

    await vehicleRepository.remove(vehicle);

    res.status(200).json({
      message: "Vehículo eliminado correctamente",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> deleteVehicle(): ",
      error
    );
    res.status(500).json({ message: "Error al eliminar el vehículo" });
  }
}

export async function assignVehicleToInstructor(req, res) {
  try {
    const vehicleRepository = AppDataSource.getRepository("Vehiculo");
    const instructorRepository = AppDataSource.getRepository("Instructor");
    const { vehicleId, instructorId } = req.body;

    if (isNaN(vehicleId) || isNaN(instructorId)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    const vehicle = await vehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ["instructores"],
    });
    const instructor = await instructorRepository.findOne({
      where: { id: instructorId },
      relations: ["vehiculos"],
    });

    if (!vehicle)
      return res.status(404).json({ message: "Vehículo no encontrado." });
    if (!instructor)
      return res.status(404).json({ message: "Instructor no encontrado." });

    if (!vehicle.instructores.find((i) => i.id === instructorId)) {
      vehicle.instructores.push(instructor);
      await vehicleRepository.save(vehicle);
    }

    res.status(200).json({
      message: "Vehículo asignado al instructor correctamente",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> assignVehicleToInstructor(): ",
      error
    );
    res.status(500).json({
      message: "Error al asignar el vehículo al instructor",
    });
  }
}

export async function removeVehicleFromInstructor(req, res) {
  try {
    const vehicleRepository = AppDataSource.getRepository("Vehiculo");
    const { vehicleId, instructorId } = req.body;

    if (isNaN(vehicleId) || isNaN(instructorId)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    const vehicle = await vehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ["instructores"],
    });

    if (!vehicle)
      return res.status(404).json({ message: "Vehículo no encontrado." });

    vehicle.instructores = vehicle.instructores.filter(
      (i) => i.id !== instructorId
    );
    await vehicleRepository.save(vehicle);

    res.status(200).json({
      message: "Instructor removido del vehículo correctamente",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> removeVehicleFromInstructor(): ",
      error
    );
    res.status(500).json({
      message: "Error al remover el instructor del vehículo",
    });
  }
}
