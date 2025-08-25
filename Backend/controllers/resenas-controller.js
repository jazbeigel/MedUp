import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import ResenasService from '../services/resenas-service.js';

const router = Router();
const currentService = new ResenasService();

// Obtener todas las reseñas
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

// Obtener reseña por ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const returnEntity = await currentService.getByIdAsync(id);
    if (returnEntity != null) {
      res.status(StatusCodes.OK).json(returnEntity);
    } else {
      res.status(StatusCodes.NOT_FOUND).send(`No se encontró la entidad (id:${id}).`);
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
  }
});

// Crear reseña
router.post('', async (req, res) => {
  try {
    let entity = req.body;

    // Validar que la calificación esté dentro del rango permitido por la BD
    const calificacion = Number(entity?.calificacion);
    if (isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send('La calificación debe estar entre 1 y 5.');
      return;
    }

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

export default router;
