import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import TurnosService from './../services/turnos-service.js';

const router = Router();
const currentService = new TurnosService();
const ALLOWED_STATUSES = ['pendiente', 'confirmado', 'rechazado', 'cancelado'];

const normalizeFilters = (query = {}) => {
  const filters = {};
  if (query.pacienteId && !Number.isNaN(Number(query.pacienteId))) {
    filters.pacienteId = Number(query.pacienteId);
  }
  if (query.profesionalId && !Number.isNaN(Number(query.profesionalId))) {
    filters.profesionalId = Number(query.profesionalId);
  }
  if (query.estado && ALLOWED_STATUSES.includes(String(query.estado).toLowerCase())) {
    filters.estado = String(query.estado).toLowerCase();
  }
  return filters;
};

router.get('', async (req, res) => {
  try {
    const filters = normalizeFilters(req.query);
    const returnArray = await currentService.listAsync(filters);
    res.status(StatusCodes.OK).json(returnArray ?? []);
  } catch (error) {
    console.error('GET /api/turnos error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const returnEntity = await currentService.getByIdAsync(id);
    if (returnEntity != null) {
      res.status(StatusCodes.OK).json(returnEntity);
    } else {
      res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
  }
});

router.post('', async (req, res) => {
  try {
    const { paciente_id, profesional_id, fecha, descripcion, estado, especialidad_id } = req.body ?? {};
    console.log('POST /api/turnos body ->', req.body);
    if (!paciente_id || !profesional_id || !fecha) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan datos obligatorios: paciente_id, profesional_id y fecha',
      });
    }
    const normalizedEstado = ALLOWED_STATUSES.includes(String(estado).toLowerCase())
      ? String(estado).toLowerCase()
      : 'pendiente';

    const fechaValida = new Date(fecha);
    if (Number.isNaN(fechaValida.getTime())) {
      return res.status(400).json({ ok: false, message: 'La fecha u hora no son válidas.' });
    }

    const turno = {
      paciente_id: Number(paciente_id),
      profesional_id: Number(profesional_id),
      fecha: fechaValida.toISOString(),
      descripcion: descripcion ?? null,
      estado: normalizedEstado,
      especialidad_id: especialidad_id ? Number(especialidad_id) : null,
    };

    const newId = await currentService.createAsync(turno);
    if (newId > 0) {
      return res.status(201).json({
        ok: true,
        id: newId,
        message: 'Turno creado correctamente',
      });
    }
    res.status(500).json({ ok: false, message: 'Error al crear el turno' });
  } catch (error) {
    console.error('POST /api/turnos error:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { estado, paciente_id, profesional_id, fecha, descripcion, especialidad_id } = req.body;

    // Validación mínima: que venga al menos un campo a actualizar
    if (
      estado === undefined &&
      paciente_id === undefined &&
      profesional_id === undefined &&
      fecha === undefined &&
      descripcion === undefined
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar al menos un campo para actualizar (por ejemplo, estado).',
      });
    }

    const rows = await currentService.updateAsync({
      id,
      estado,
      paciente_id,
      profesional_id,
      fecha,
      descripcion,
      especialidad_id,
    });

    if (rows > 0) {
      return res.status(200).json({ ok: true, message: 'Turno actualizado.' });
    } else {
      return res.status(404).json({ ok: false, message: `No se encontró el turno (id:${id}).` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

router.patch('/:id/estado', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'ID inválido.' });
  }

  try {
    const { estado } = req.body ?? {};
    const normalized = String(estado ?? '').toLowerCase();
    if (!ALLOWED_STATUSES.includes(normalized)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: `Estado inválido. Valores permitidos: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const rows = await currentService.updateEstadoAsync(id, normalized);
    if (!rows) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Turno no encontrado.' });
    }

    return res.status(StatusCodes.OK).json({ ok: true, message: 'Estado actualizado.' });
  } catch (error) {
    console.error('PATCH /api/turnos/:id/estado error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

export default router;
