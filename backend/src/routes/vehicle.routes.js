"use strict";
import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  getFleetSummary,
  updateVehicle,
  deleteVehicle,
  updateMaintenance,
  assignVehicleToInstructor,
  removeVehicleFromInstructor,
} from "../controllers/vehicle.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin, isAuthorized, populateUser } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.use(populateUser);

router.post("/", isAdmin, createVehicle);

router.get("/", getVehicles);
router.get("/summary", isAuthorized(["administrador", "secretaria"]), getFleetSummary);
router.get("/:id", getVehicleById);

router.put("/:id", isAdmin, updateVehicle);

router.post("/:id/maintenance", updateMaintenance);

router.delete("/:id", isAdmin, deleteVehicle);

router.post("/assign", isAdmin, assignVehicleToInstructor);

router.post("/unassign", isAdmin, removeVehicleFromInstructor);

export default router;
