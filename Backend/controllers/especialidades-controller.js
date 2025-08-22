import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import EspecialidadesService from './../services/especialidades-service.js'

const router = Router();
const currentService = new EspecialidadesService();

router.get('', async (req, res) => {
    console.log(`EspecialidadesController.get`);
    const returnArray = await currentService.getAllAsync();
    if (returnArray != null){
        res.status(StatusCodes.OK).json(returnArray);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error interno.`);
    }
});
export default router;