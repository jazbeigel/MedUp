import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import PacientesService from './../services/pacientes-service.js';

const router = Router();
const currentService = new PacientesService();

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

// POST: mapear password -> contrasena y manejar duplicado de email
router.post('', async (req, res) => {
  try {
    const body = req.body;

    // Normalizo fecha si vino con barras (opcional)
    const fechaNormalizada =
      typeof body.fecha_nacimiento === 'string'
        ? body.fecha_nacimiento.replaceAll('/', '-')
        : body.fecha_nacimiento;

    const mappedPassword = body.contrasena ?? body.password;

    const entity = {
      ...body,
      ...(fechaNormalizada ? { fecha_nacimiento: fechaNormalizada } : {}),
      ...(mappedPassword !== undefined ? { contrasena: mappedPassword } : {}),
    };

    const paciente = await currentService.createAsync(entity);
    res.status(StatusCodes.CREATED).json(paciente);
  } catch (error) {
    // Duplicado (unique violation)
    if (error?.code === '23505' && String(error?.constraint).includes('pacientes_email_key')) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'El email ya está registrado.' });
    }
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

// PUT: aceptar password y mapearlo a contrasena
router.put('/', async (req, res) => {
  try {
    const body = req.body;

    const fechaNormalizada =
      typeof body.fecha_nacimiento === 'string'
        ? body.fecha_nacimiento.replaceAll('/', '-')
        : body.fecha_nacimiento;

    const mappedPassword = body.contrasena ?? body.password;

    const entity = {
      ...body,
      ...(fechaNormalizada ? { fecha_nacimiento: fechaNormalizada } : {}),
      ...(mappedPassword !== undefined ? { contrasena: mappedPassword } : {}),
    };

    const rowsAffected = await currentService.updateAsync(entity);
    if (rowsAffected != 0) {
      res.status(StatusCodes.OK).json(rowsAffected);
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`No se encontro la entidad (id:${entity.id}).`);
    }
  } catch (error) {
    // Si quisieras, acá también podrías detectar duplicado de email
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
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

export default router;
