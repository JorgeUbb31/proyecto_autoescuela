"use strict";
import { Router } from "express";
import {
  createLicense,
  getLicenses,
  getLicenseById,
  updateLicense,
  deleteLicense,
} from "../controllers/license.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { populateUser } from "../middleware/authorization.middleware.js";

const router = Router();

// Middleware de autenticación
router.use(authenticateJwt);
router.use(populateUser);

// Solo administradores e instructores pueden crear licencias
router.post("/", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador" && req.user.role !== "instructor" && req.user.role !== "profesor") {
      return res.status(403).json({
        message: "No tienes permisos para crear licencias.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, createLicense);

// Cualquier usuario autenticado puede ver licencias
router.get("/", getLicenses);
router.get("/:id", getLicenseById);

// Solo administradores e instructores pueden actualizar licencias
router.put("/:id", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador" && req.user.role !== "instructor" && req.user.role !== "profesor") {
      return res.status(403).json({
        message: "No tienes permisos para actualizar licencias.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, updateLicense);

// Solo administradores pueden eliminar licencias
router.delete("/:id", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para eliminar licencias.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, deleteLicense);

export default router;
