"use strict";
import { Router } from "express";
import { getUsers, getUserById, getProfile, updateUserById, deleteUserById, getPublicUsers, changeUserRole } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.get("/public", getPublicUsers);

router.use(authenticateJwt);

router.get("/profile", getProfile);

router.use(isAdmin);

router.put("/:userId/role", changeUserRole);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;