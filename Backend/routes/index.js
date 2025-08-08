import { Router } from "express";
import authRoutes from "./authRoutes.js";
import turnosRoutes from "./turnosRoutes.js";
import utilitiesRoutes from "./utilitiesRoutes.js";

const router = Router();

// Rutas de autenticación
router.use("/", authRoutes);

// Rutas de turnos
router.use("/", turnosRoutes);

// Rutas de utilidades
router.use("/", utilitiesRoutes);

export default router;
