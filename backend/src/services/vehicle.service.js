"use strict";
import { AppDataSource } from "../config/configDb.js";
import { mapVehicle, mapVehicles } from "./response.mapper.js";
import { sendMaintenanceNotification } from "../helpers/email.helper.js";

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

  return mapVehicle(newVehicle);
}

/**
 * Obtiene todos los vehículos con filtrado según rol del usuario
 */
export async function getAllVehicles(userRole = null, userId = null) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");

  if (userRole === "instructor" || userRole === "profesor") {
    const instructorRepository = AppDataSource.getRepository("Instructor");
    const instructor = await instructorRepository
      .createQueryBuilder("instructor")
      .leftJoinAndSelect("instructor.vehiculos", "vehiculo")
      .leftJoinAndSelect("instructor.usuario", "usuario")
      .where("usuario.id = :userId", { userId })
      .getOne();

    const assignedVehicles = instructor?.vehiculos || [];
    return mapVehicles(assignedVehicles, userRole);
  }

  const vehicles = await vehicleRepository.find({
    relations: ["instructores"],
  });

  const filteredVehicles = userRole === "secretaria"
    ? vehicles.filter((vehicle) => vehicle.disponible)
    : vehicles;

  return mapVehicles(filteredVehicles, userRole);
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

  return mapVehicle(vehicle);
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

  return mapVehicle(updatedVehicle);
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

  return mapVehicle(vehicle);
}

export async function updateMaintenance(vehicleId, maintenanceData, userRole) {
  const vehicleRepository = AppDataSource.getRepository("Vehiculo");
  const instructorRepository = AppDataSource.getRepository("Instructor");

  const vehicle = await vehicleRepository.findOne({
    where: { id: vehicleId },
    relations: ["instructores", "instructores.usuario"],
  });

  if (!vehicle) {
    throw new Error("Vehículo no encontrado.");
  }

  if (userRole === "secretaria" || userRole === "administrador") {
    const shouldBeInMaintenance = maintenanceData.enMantenimiento === true;
    vehicle.enMantenimiento = shouldBeInMaintenance;
    vehicle.requiereMantenimiento = shouldBeInMaintenance;
    vehicle.comentarioMantenimiento = maintenanceData.comentarioMantenimiento || vehicle.comentarioMantenimiento;
    vehicle.nivelVencina = maintenanceData.nivelVencina || vehicle.nivelVencina;
    vehicle.disponible = !shouldBeInMaintenance;
  } else if (userRole === "instructor" || userRole === "profesor") {
    vehicle.requiereMantenimiento = maintenanceData.requiereMantenimiento !== false;
    vehicle.comentarioMantenimiento = maintenanceData.comentarioMantenimiento || vehicle.comentarioMantenimiento;
    vehicle.nivelVencina = maintenanceData.nivelVencina || vehicle.nivelVencina;
    vehicle.enMantenimiento = false;
    vehicle.disponible = false;
  }

  await vehicleRepository.save(vehicle);

  const assignedInstructor = vehicle.instructores?.[0];
  if (assignedInstructor?.correo || assignedInstructor?.usuario?.email) {
    await sendMaintenanceNotification({
      to: assignedInstructor.correo || assignedInstructor.usuario.email,
      instructorName: assignedInstructor.usuario?.username || assignedInstructor.correo || 'Instructor',
      vehicleMatricula: vehicle.matricula,
      comment: vehicle.comentarioMantenimiento,
      nivelVencimiento: vehicle.nivelVencina,
    });
  }

  return mapVehicle(vehicle);
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
