"use strict";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crea un nuevo vehículo
 */
export async function createVehicle(vehicleData) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");

  const existingVehicle = await vehicleRepository.findOne({
    where: { matricula: vehicleData.matricula },
  });

  if (existingVehicle) {
    throw new Error("Un vehículo con esta matrícula ya existe.");
  }

  const newVehicle = vehicleRepository.create({
    matricula: vehicleData.matricula,
    marca: vehicleData.marca,
    modelo: vehicleData.modelo,
    ano: vehicleData.ano,
    tipo: vehicleData.tipo,
    transmision: vehicleData.transmision,
    vencimientoPatente: vehicleData.vencimientoPatente,
    vencimientoRevisionTecnica: vehicleData.vencimientoRevisionTecnica,
    disponible: vehicleData.disponible !== false,
  });

  await vehicleRepository.save(newVehicle);

  return newVehicle;
}

/**
 * Obtiene todos los vehículos con filtrado según rol del usuario
 */
export async function getAllVehicles(userRole = null) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");
  const vehicles = await vehicleRepository.find({
    relations: ["instructores"],
  });

  // Si el usuario es secretaria, solo mostrar vehículos disponibles
  if (userRole === "secretaria") {
    return vehicles
      .filter((v) => v.disponible)
      .map((v) => ({
        id: v.id,
        matricula: v.matricula,
        marca: v.marca,
        modelo: v.modelo,
        ano: v.ano,
        tipo: v.tipo,
        transmision: v.transmision,
        disponible: v.disponible,
        instructoresAsignados: v.instructores.map((i) => i.id),
      }));
  }

  return vehicles;
}

/**
 * Obtiene un vehículo por su ID
 */
export async function getVehicleById(vehicleId) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");

  const vehicle = await vehicleRepository.findOne({
    where: { id: vehicleId },
    relations: ["instructores"],
  });

  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }

  return vehicle;
}

/**
 * Actualiza un vehículo
 */
export async function updateVehicle(vehicleId, updateData) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");

  const vehicle = await vehicleRepository.findOne({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }

  // Validar que la matrícula no esté duplicada
  if (updateData.matricula && updateData.matricula !== vehicle.matricula) {
    const existingVehicle = await vehicleRepository.findOne({
      where: { matricula: updateData.matricula },
    });
    if (existingVehicle) {
      throw new Error("Un vehículo con esta matrícula ya existe.");
    }
  }

  const updatedVehicle = {
    ...vehicle,
    ...updateData,
  };

  await vehicleRepository.save(updatedVehicle);

  return updatedVehicle;
}

/**
 * Elimina un vehículo
 */
export async function deleteVehicle(vehicleId) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");

  const vehicle = await vehicleRepository.findOne({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }

  await vehicleRepository.remove(vehicle);

  return vehicle;
}

/**
 * Asigna un vehículo a un instructor
 */
export async function assignVehicleToInstructor(vehicleId, instructorId) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");
  const instructorRepository = AppDataSource.getRepository("Instructor");

  const vehicle = await vehicleRepository.findOne({
    where: { id: vehicleId },
    relations: ["instructores"],
  });

  const instructor = await instructorRepository.findOne({
    where: { id: instructorId },
    relations: ["vehiculos"],
  });

  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }

  if (!instructor) {
    throw new Error("Instructor no encontrado.");
  }

  // Evitar duplicados
  if (!vehicle.instructores.find((i) => i.id === instructorId)) {
    vehicle.instructores.push(instructor);
    await vehicleRepository.save(vehicle);
  }

  return vehicle;
}

/**
 * Remueve un vehículo de un instructor
 */
export async function removeVehicleFromInstructor(vehicleId, instructorId) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");

  const vehicle = await vehicleRepository.findOne({
    where: { id: vehicleId },
    relations: ["instructores"],
  });

  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }

  vehicle.instructores = vehicle.instructores.filter(
    (i) => i.id !== instructorId
  );

  await vehicleRepository.save(vehicle);

  return vehicle;
}
