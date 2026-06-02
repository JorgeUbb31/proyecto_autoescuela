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
import { isAdmin, isAdminOrInstructor, populateUser } from "../middleware/authorization.middleware.js";
import upload from "../config/uploadConfig.js";

const router = Router();
router.use(authenticateJwt);
router.use(populateUser);

router.post("/", upload.single('imagen'), isAdminOrInstructor, createLicense);

router.get("/", getLicenses);
router.get("/:id", getLicenseById);

router.put("/:id", isAdminOrInstructor, updateLicense);

router.delete("/:id", isAdmin, deleteLicense);

export default router;
