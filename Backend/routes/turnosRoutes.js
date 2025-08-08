import { Router } from "express";
import { 
  getProfesionales, 
  createTurno, 
  getTurnosPaciente, 
  getTurnosProfesional, 
  cancelarTurno 
} from "../controllers/turnosController.js";

const router = Router();

// Obtener todos los profesionales
router.get("/profesionales", getProfesionales);

// Crear un nuevo turno
router.post("/turnos", createTurno);

// Obtener turnos de un paciente
router.get("/turnos/paciente/:pacienteId", getTurnosPaciente);

// Obtener turnos de un profesional
router.get("/turnos/profesional/:profesionalId", getTurnosProfesional);

// Cancelar turno
router.delete("/turnos/:turnoId", cancelarTurno);

export default router;
