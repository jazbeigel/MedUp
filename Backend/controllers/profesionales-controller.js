import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import ProfesionalesService from './../services/profesionales-service.js';

const router = Router();
const currentService = new ProfesionalesService();

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

// POST: mapear password -> contrasena
router.post('', async (req, res) => {
  try {
    const body = req.body;

    // Si viene "password", lo mapeamos a "contrasena"
    const mappedPassword = body.contrasena ?? body.password;

    const entity = {
      ...body,
      // Solo seteamos contrasena si vino alguno (evitamos null explícito)
      ...(mappedPassword !== undefined ? { contrasena: mappedPassword } : {}),
    };

    const newId = await currentService.createAsync(entity);
    if (newId > 0) {
      res.status(StatusCodes.CREATED).json(newId);
    } else {
      res.status(StatusCodes.BAD_REQUEST).json(null);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
  }
});

// PUT: también aceptar password y mapearlo a contrasena
router.put('/', async (req, res) => {
  try {
    const body = req.body;

    const mappedPassword = body.contrasena ?? body.password;

    const entity = {
      ...body,
      // En update conviene no pisar si no vino: solo incluimos si existe
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
