"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import licenseRoutes from "./license.routes.js";
import instructorRoutes from "./instructor.routes.js";
import vehicleRoutes from "./vehicle.routes.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";


const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", authenticateJwt, userRoutes);
router.use("/licenses", authenticateJwt, licenseRoutes);
router.use("/instructors", authenticateJwt, instructorRoutes);
router.use("/vehicles", authenticateJwt, vehicleRoutes);


export default router;