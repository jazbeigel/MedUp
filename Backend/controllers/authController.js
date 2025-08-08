import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Middleware para validar datos de registro
export const validateRegistrationData = (req, res, next) => {
  const { email, password, nombre_completo, fecha_nacimiento, dni, direccion, telefono, tipo_usuario } = req.body;
  
  if (!email || !password || !nombre_completo || !fecha_nacimiento || !dni || !direccion || !telefono || !tipo_usuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!["paciente", "profesional"].includes(tipo_usuario)) {
    return res.status(400).json({ error: "Tipo de usuario debe ser 'paciente' o 'profesional'" });
  }

  next();
};

// Registro de usuarios
export const registerUser = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      nombre_completo, 
      fecha_nacimiento, 
      dni, 
      direccion, 
      telefono, 
      tipo_usuario,
      matricula,
      especialidad,
      id_especialidad
    } = req.body;

    // Verificar si el email ya existe
    const existingUser = await prisma.usuarios.findFirst({
      where: {
        OR: [
          { pacientes: { some: { dni } } },
          { profesionales: { some: { matricula } } }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: "Usuario ya existe con este DNI o email" });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario base
    const newUser = await prisma.usuarios.create({
      data: {}
    });

    let userData;
    
    if (tipo_usuario === "paciente") {
      userData = await prisma.pacientes.create({
        data: {
          usuario_id: newUser.id,
          nombre_completo,
          fecha_nacimiento: new Date(fecha_nacimiento),
          dni,
          direccion,
          telefono,
          email,
          password_hash: hashedPassword
        }
      });
    } else if (tipo_usuario === "profesional") {
      if (!matricula || !especialidad || !id_especialidad) {
        return res.status(400).json({ error: "Profesionales requieren matrícula, especialidad e ID de especialidad" });
      }

      userData = await prisma.profesionales.create({
        data: {
          usuario_id: newUser.id,
          nombre_completo,
          matricula,
          especialidad,
          telefono,
          id_especialidad,
          email,
          password_hash: hashedPassword
        }
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser.id, tipo_usuario },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser.id,
        tipo_usuario,
        ...userData
      }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Login de usuarios
export const loginUser = async (req, res) => {
  try {
    const { email, password, tipo_usuario } = req.body;

    if (!email || !password || !tipo_usuario) {
      return res.status(400).json({ error: "Email, contraseña y tipo de usuario son requeridos" });
    }

    let user;
    
    if (tipo_usuario === "paciente") {
      user = await prisma.pacientes.findFirst({
        where: { email }
      });
    } else if (tipo_usuario === "profesional") {
      user = await prisma.profesionales.findFirst({
        where: { email }
      });
    }

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash || password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id, tipo_usuario },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        tipo_usuario
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
