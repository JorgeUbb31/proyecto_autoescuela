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
import { isAdmin, isAdminOrInstructor, populateUser } from "../middleware/authorization.middleware.js";

const router = Router();
router.use(authenticateJwt);
router.use(populateUser);

router.post("/", isAdmin, createInstructor);

// Cualquier usuario autenticado puede ver instructores (con filtrado si es secretaria)
router.get("/", getInstructors);
router.get("/:id", getInstructorById);

// Solo administradores e instructores pueden actualizar su información
router.put("/:id", isAdminOrInstructor, updateInstructor);

router.delete("/:id", isAdmin, deleteInstructor);

export default router;
