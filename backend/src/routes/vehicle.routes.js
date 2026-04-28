"use strict";
import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  assignVehicleToInstructor,
  removeVehicleFromInstructor,
} from "../controllers/vehicle.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { populateUser } from "../middleware/authorization.middleware.js";

const router = Router();

// Middleware de autenticación
router.use(authenticateJwt);
router.use(populateUser);

// Solo administradores pueden crear vehículos
router.post("/", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para crear vehículos.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, createVehicle);

// Cualquier usuario autenticado puede ver vehículos (con filtrado si es secretaria)
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Solo administradores pueden actualizar vehículos
router.put("/:id", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para actualizar vehículos.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, updateVehicle);

// Solo administradores pueden eliminar vehículos
router.delete("/:id", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para eliminar vehículos.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, deleteVehicle);

// Solo administradores pueden asignar vehículos a instructores
router.post("/assign", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para asignar vehículos.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, assignVehicleToInstructor);

// Solo administradores pueden remover vehículos de instructores
router.post("/unassign", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para remover vehículos.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, removeVehicleFromInstructor);

export default router;
