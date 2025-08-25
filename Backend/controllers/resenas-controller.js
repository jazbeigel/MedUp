import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import ResenasService from '../services/resenas-service.js';

const router = Router();
const currentService = new ResenasService();

router.get('', async (req, res) => {
    console.log(`ResenasController.get`);
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

export default router;