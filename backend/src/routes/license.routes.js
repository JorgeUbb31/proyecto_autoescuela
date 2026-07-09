"use strict";
import { Router } from "express";
import {
  createLicense,
  getLicenses,
  getLicenseById,
  getLicenseSummary,
  updateLicense,
  deleteLicense,
} from "../controllers/license.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin, isAdminOrInstructor, isAuthorized, populateUser } from "../middleware/authorization.middleware.js";
import upload from "../config/uploadConfig.js";

const router = Router();
router.use(authenticateJwt);
router.use(populateUser);

router.post(
  "/",
  upload.fields([
    { name: "imagen", maxCount: 1 },
    { name: "imagenRuta", maxCount: 1 },
  ]),
  createLicense
);

router.get("/summary", isAuthorized(["administrador", "secretaria"]), getLicenseSummary);
router.get("/", getLicenses);
router.get("/:id", getLicenseById);

router.put(
  "/:id",
  isAdminOrInstructor,
  upload.fields([
    { name: "imagen", maxCount: 1 },
    { name: "imagenRuta", maxCount: 1 },
  ]),
  updateLicense
);

router.delete("/:id", isAdmin, deleteLicense);

export default router;
