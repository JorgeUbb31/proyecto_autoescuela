"use strict";
import { Router } from "express";
import {
  createInstructor,
  getInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructor.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { populateUser } from "../middleware/authorization.middleware.js";

const router = Router();

// Middleware de autenticación
router.use(authenticateJwt);
router.use(populateUser);

// Solo administradores pueden crear instructores
router.post("/", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para crear instructores.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, createInstructor);

// Cualquier usuario autenticado puede ver instructores (con filtrado si es secretaria)
router.get("/", getInstructors);
router.get("/:id", getInstructorById);

// Solo administradores e instructores pueden actualizar su información
router.put("/:id", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador" && req.user.role !== "instructor" && req.user.role !== "profesor") {
      return res.status(403).json({
        message: "No tienes permisos para actualizar instructores.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, updateInstructor);

// Solo administradores pueden eliminar instructores
router.delete("/:id", async (req, res, next) => {
  try {
    if (req.user.role !== "administrador") {
      return res.status(403).json({
        message: "No tienes permisos para eliminar instructores.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error en autorización" });
  }
}, deleteInstructor);

export default router;
