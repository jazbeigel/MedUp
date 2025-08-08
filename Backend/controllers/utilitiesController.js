import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener especialidades
export const getEspecialidades = async (req, res) => {
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
};

// Verificar disponibilidad de email/DNI
export const checkAvailability = async (req, res) => {
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
};
