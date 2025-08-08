import { Router } from "express";
import { registerUser, loginUser, validateRegistrationData } from "../controllers/authController.js";

const router = Router();

// Registro de usuarios
router.post("/register", validateRegistrationData, registerUser);

// Login de usuarios
router.post("/login", loginUser);

export default router;
