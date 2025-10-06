import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import TurnosService from './../services/turnos-service.js';

const router = Router();
const currentService = new TurnosService();

router.get('', async (req, res) => {
  try {
    const returnArray = await currentService.getAllAsync();
    if (returnArray != null) {
      res.status(StatusCodes.OK).json(returnArray);
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
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
    const { paciente_id, profesional_id, fecha } = req.body;
    if (!paciente_id || !profesional_id || !fecha) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan datos obligatorios: paciente_id, profesional_id y fecha',
      });
    }
    const turno = { paciente_id, profesional_id, fecha };
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
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const rowCount = await currentService.deleteByIdAsync(id);
    if (rowCount != 0) {
      res.status(StatusCodes.OK).json(rowCount);
    } else {
      res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { estado, paciente_id, profesional_id, fecha } = req.body;

    // Validación mínima: que venga al menos un campo a actualizar
    if (
      estado === undefined &&
      paciente_id === undefined &&
      profesional_id === undefined &&
      fecha === undefined
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
      fecha
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


export default router;
