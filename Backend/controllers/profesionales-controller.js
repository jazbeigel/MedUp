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

    // POST /api/profesionales/login
    router.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Email y password son requeridos.' });
        }
  
        const profesional = await currentService.getByEmailAsync(String(email).trim().toLowerCase());

        if (!profesional) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'Credenciales inválidas.' });
        }
  
        // En tu esquema actual guardás "contrasena" en texto plano.
        // Si en algún momento migrás a hash, acá deberías usar bcrypt.compare().
        const stored = profesional.contrasena ?? profesional.password ?? '';
        const ok = String(stored) === String(password);
  
        if (!ok) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: 'Credenciales inválidas.' });
        }
  
        // Armar respuesta "safe" (sin contrasena)
        const { contrasena, password: _pwd, ...safeUser } = profesional;
  
        // (Opcional) acá podrías generar un JWT si querés:
        const token = jwt.sign({ sub: profesional.id, role: 'profesional' }, process.env.JWT_SECRET, { expiresIn: '1h' });
         return res.status(StatusCodes.OK).json({ user: safeUser, token });
  
        return res.status(StatusCodes.OK).json({ user: safeUser });
      } catch (error) {
        console.error('Error en /api/profesionales/login:', error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Error interno.' });
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
