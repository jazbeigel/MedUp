import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

// Middleware para validar datos de registro
const validateRegistrationData = (req, res, next) => {
  const { email, password, nombre_completo, fecha_nacimiento, dni, direccion, telefono, tipo_usuario } = req.body;
  
  if (!email || !password || !nombre_completo || !fecha_nacimiento || !dni || !direccion || !telefono || !tipo_usuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!["paciente", "profesional"].includes(tipo_usuario)) {
    return res.status(400).json({ error: "Tipo de usuario debe ser 'paciente' o 'profesional'" });
  }

  next();
};

// Registro de usuarios con filtros
router.post("/register", validateRegistrationData, async (req, res) => {
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
      // Campos adicionales para profesionales
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
});

// Login de usuarios
router.post("/login", async (req, res) => {
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

    // Verificar contraseña (aquí deberías tener un campo password_hash en tu modelo)
    // Por ahora, asumimos que el password está almacenado en el modelo correspondiente
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
});

// Obtener especialidades (para filtros de registro)
router.get("/especialidades", async (req, res) => {
  try {
    const especialidades = await prisma.especialidades.findMany({
      select: {
        id: true,
        nombre: true
      }
    });
    
    res.json(especialidades);
  } catch (error) {
    console.error("Error obteniendo especialidades:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Verificar disponibilidad de email/DNI
router.post("/check-availability", async (req, res) => {
  try {
    const { email, dni, matricula } = req.body;
    
    let exists = false;
    
    if (email) {
      const paciente = await prisma.pacientes.findFirst({ where: { email } });
      const profesional = await prisma.profesionales.findFirst({ where: { email } });
      exists = exists || paciente || profesional;
    }
    
    if (dni) {
      const paciente = await prisma.pacientes.findFirst({ where: { dni } });
      exists = exists || paciente;
    }
    
    if (matricula) {
      const profesional = await prisma.profesionales.findFirst({ where: { matricula } });
      exists = exists || profesional;
    }
    
    res.json({ available: !exists });
  } catch (error) {
    console.error("Error verificando disponibilidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener todos los profesionales (para selección de doctor)
router.get("/profesionales", async (req, res) => {
  try {
    const profesionales = await prisma.profesionales.findMany({
      select: {
        id: true,
        nombre_completo: true,
        especialidad: true,
        matricula: true,
        telefono: true,
        especialidadRef: {
          select: {
            nombre: true
          }
        }
      },
      include: {
        especialidadRef: true
      }
    });
    
    res.json(profesionales);
  } catch (error) {
    console.error("Error obteniendo profesionales:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un nuevo turno
router.post("/turnos", async (req, res) => {
  try {
    const { paciente_id, profesional_id, fecha, hora } = req.body;

    if (!paciente_id || !profesional_id || !fecha || !hora) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Combinar fecha y hora
    const fechaHora = new Date(`${fecha}T${hora}`);

    // Verificar que la fecha no sea en el pasado
    if (fechaHora <= new Date()) {
      return res.status(400).json({ error: "La fecha y hora deben ser futuras" });
    }

    // Verificar disponibilidad del profesional en esa fecha/hora
    const turnoExistente = await prisma.turnos.findFirst({
      where: {
        profesional_id,
        fecha: fechaHora
      }
    });

    if (turnoExistente) {
      return res.status(409).json({ error: "El profesional no está disponible en esa fecha y hora" });
    }

    const nuevoTurno = await prisma.turnos.create({
      data: {
        paciente_id,
        profesional_id,
        fecha: fechaHora,
        creado_el: new Date()
      },
      include: {
        paciente: {
          select: {
            nombre_completo: true,
            email: true
          }
        },
        profesional: {
          select: {
            nombre_completo: true,
            especialidad: true
          }
        }
      }
    });

    res.status(201).json({
      message: "Turno creado exitosamente",
      turno: nuevoTurno
    });

  } catch (error) {
    console.error("Error creando turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener turnos de un paciente
router.get("/turnos/paciente/:pacienteId", async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const turnos = await prisma.turnos.findMany({
      where: {
        paciente_id: pacienteId
      },
      include: {
        profesional: {
          select: {
            nombre_completo: true,
            especialidad: true,
            matricula: true
          }
        }
      },
      orderBy: {
        fecha: 'asc'
      }
    });

    res.json(turnos);
  } catch (error) {
    console.error("Error obteniendo turnos del paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener turnos de un profesional
router.get("/turnos/profesional/:profesionalId", async (req, res) => {
  try {
    const { profesionalId } = req.params;

    const turnos = await prisma.turnos.findMany({
      where: {
        profesional_id: profesionalId
      },
      include: {
        paciente: {
          select: {
            nombre_completo: true,
            email: true,
            telefono: true
          }
        }
      },
      orderBy: {
        fecha: 'asc'
      }
    });

    res.json(turnos);
  } catch (error) {
    console.error("Error obteniendo turnos del profesional:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Cancelar turno
router.delete("/turnos/:turnoId", async (req, res) => {
  try {
    const { turnoId } = req.params;

    const turno = await prisma.turnos.findUnique({
      where: { id: turnoId }
    });

    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    await prisma.turnos.delete({
      where: { id: turnoId }
    });

    res.json({ message: "Turno cancelado exitosamente" });
  } catch (error) {
    console.error("Error cancelando turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
