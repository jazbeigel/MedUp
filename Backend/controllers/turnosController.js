import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los profesionales
export const getProfesionales = async (req, res) => {
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
};

// Crear un nuevo turno
export const createTurno = async (req, res) => {
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
};

// Obtener turnos de un paciente
export const getTurnosPaciente = async (req, res) => {
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
};

// Obtener turnos de un profesional
export const getTurnosProfesional = async (req, res) => {
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
};

// Cancelar turno
export const cancelarTurno = async (req, res) => {
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
};
