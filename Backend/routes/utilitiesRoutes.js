import { Router } from "express";
import { getEspecialidades, checkAvailability } from "../controllers/utilitiesController.js";

const router = Router();

// Obtener especialidades
router.get("/especialidades", getEspecialidades);

// Verificar disponibilidad
router.post("/check-availability", checkAvailability);

export default router;
