import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import TurnosService from './../services/Turnos-service.js'

const router = Router();
const currentService = new TurnosService();

router.get('', async (req, res) => {
    console.log(`TurnosController.get`);
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
    console.log("📩 Body recibido:", req.body);

    try {
        const { paciente_id, profesional_id, fecha } = req.body;

        // Validación
        if (!paciente_id || !profesional_id || !fecha) {
            return res.status(400).json({
                ok: false,
                message: "Faltan datos obligatorios: paciente_id, profesional_id y fecha"
            });
        }

        const turno = { paciente_id, profesional_id, fecha };

        const newId = await currentService.createAsync(turno);

        if (newId > 0) {
            return res.status(201).json({
                ok: true,
                id: newId,
                message: "Turno creado correctamente"
            });
        }

        res.status(500).json({ ok: false, message: "Error al crear el turno" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error interno del servidor" });
    }
});

/*
router.put('/', async (req, res) => {
    let entity = req.body;
    const rowsAffected = await currentService.updateAsync(entity);
    if (rowsAffected != 0){
        res.status(StatusCodes.OK).json(rowsAffected);
    } else {
        res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${entity.id}).`);
    }
});

*/

router.delete('/:id', async (req, res) => {
    let respuesta;
    let id = req.params.id;
    const rowCount = await currentService.deleteByIdAsync(id);
    if (rowCount != 0){
      res.status(StatusCodes.OK).json(respuesta);
    } else {
      res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
    }
});

export default router;