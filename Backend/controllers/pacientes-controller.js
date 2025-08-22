import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import PacientesService from './../services/pacientes-service.js'

const router = Router();
const currentService = new PacientesService();

router.get('', async (req, res) => {
    console.log(`PacientesController.get`);
    const returnArray = await currentService.getAllAsync();
    if (returnArray != null){
        res.status(StatusCodes.OK).json(returnArray);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
    }
});

router.get('/:id', async (req, res) => {
    let id = req.params.id;

    const returnEntity = await currentService.getByIdAsync(id);

    if (returnEntity!=null){
        res.status(StatusCodes.OK).json(returnEntity);
    } else {
        res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
    }
});

router.post('', async (req, res) => {
    let entity = req.body;
    const newId = await currentService.createAsync(entity);
    if (newId > 0 ){
        res.status(StatusCodes.CREATED).json(newId);
    } else {
        res.status(StatusCodes.BAD_REQUEST).json(null);
    }
});

router.put('/', async (req, res) => {
    let entity = req.body;
    const rowsAffected = await currentService.updateAsync(entity);
    if (rowsAffected != 0){
        res.status(StatusCodes.OK).json(rowsAffected);
    } else {
        res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${entity.id}).`);
    }
});

router.delete('/:id', async (req, res) => {
    let respuesta;
    let id = req.params.id;
    console.log("EST ACAAAA!:", id)
    const rowCount = await currentService.deleteByIdAsync(id);
    if (rowCount != 0){
      res.status(StatusCodes.OK).json(respuesta);
    } else {
      res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
    }
});

export default router;