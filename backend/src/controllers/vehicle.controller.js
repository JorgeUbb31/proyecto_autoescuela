"use strict";
import {
  createVehicleValidation,
  updateVehicleValidation,
  maintenanceVehicleValidation,
} from "../validations/vehicle.validation.js";
import * as vehicleService from "../services/vehicle.service.js";

export async function createVehicle(req, res) {
  try {
    const { error } = createVehicleValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newVehicle = await vehicleService.createVehicle(req.body);

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
    
    if (error.message.includes("ya existe")) {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al crear el vehículo" });
  }
}

export async function getVehicles(req, res) {
  try {
    const vehicles = await vehicleService.getAllVehicles(req.user.role, req.user.id);

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
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId))
      return res.status(400).json({ message: "ID inválido" });

    const vehicle = await vehicleService.getVehicleById(vehicleId);

    res.status(200).json({ message: "Vehículo encontrado", data: vehicle });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> getVehicleById(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al obtener el vehículo" });
  }
}

export async function getFleetSummary(req, res) {
  try {
    const summary = await vehicleService.getFleetSummary(req.user.role);

    res.status(200).json({ message: "Resumen de la flota", data: summary });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> getFleetSummary(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener el resumen de la flota" });
  }
}

export async function updateVehicle(req, res) {
  try {
    const vehicleId = parseInt(req.params.id);
    const { error } = updateVehicleValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (isNaN(vehicleId))
      return res.status(400).json({ message: "ID inválido" });

    const updatedVehicle = await vehicleService.updateVehicle(vehicleId, req.body);

    res.status(200).json({
      message: "Vehículo actualizado correctamente",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> updateVehicle(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("ya existe")) {
      return res.status(409).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al actualizar el vehículo" });
  }
}

export async function deleteVehicle(req, res) {
  try {
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId))
      return res.status(400).json({ message: "ID inválido" });

    const deletedVehicle = await vehicleService.deleteVehicle(vehicleId);

    res.status(200).json({
      message: "Vehículo eliminado correctamente",
      data: deletedVehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> deleteVehicle(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error al eliminar el vehículo" });
  }
}

export async function updateMaintenance(req, res) {
  try {
    const vehicleId = parseInt(req.params.id);
    const { error } = maintenanceVehicleValidation.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });
    if (isNaN(vehicleId)) return res.status(400).json({ message: "ID inválido" });

    const updatedVehicle = await vehicleService.updateMaintenance(vehicleId, req.body, req.user.role);

    res.status(200).json({
      message: "Estado de mantenimiento actualizado correctamente",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Error en vehicle.controller.js -> updateMaintenance(): ", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Error al actualizar el mantenimiento" });
  }
}

export async function assignVehicleToInstructor(req, res) {
  try {
    const { vehicleId, instructorId } = req.body;

    if (isNaN(vehicleId) || isNaN(instructorId)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    const vehicle = await vehicleService.assignVehicleToInstructor(vehicleId, instructorId);

    res.status(200).json({
      message: "Vehículo asignado al instructor correctamente",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> assignVehicleToInstructor(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({
      message: "Error al asignar el vehículo al instructor",
    });
  }
}

export async function removeVehicleFromInstructor(req, res) {
  try {
    const { vehicleId, instructorId } = req.body;

    if (isNaN(vehicleId) || isNaN(instructorId)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    const vehicle = await vehicleService.removeVehicleFromInstructor(vehicleId, instructorId);

    res.status(200).json({
      message: "Instructor removido del vehículo correctamente",
      data: vehicle,
    });
  } catch (error) {
    console.error(
      "Error en vehicle.controller.js -> removeVehicleFromInstructor(): ",
      error
    );
    
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({
      message: "Error al remover el instructor del vehículo",
    });
  }
}
