"use strict";
import { Router } from "express";
import {
  register,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();


router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticateJwt, logout);

export default router;
