// pacientes-controller.js
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import PacientesService from './../services/pacientes-service.js';
// SI luego querés token, importá jwt y usa una secret válida:
// import jwt from 'jsonwebtoken';

const router = Router();
const currentService = new PacientesService();

router.get('', async (req, res) => {
  try {
    const returnArray = await currentService.getAllAsync();
    // opcional: ocultar contrasena en listados
    const safe = (returnArray ?? []).map(({ contrasena, password, ...r }) => r);
    res.status(StatusCodes.OK).json(safe);
  } catch (error) {
    console.error('GET /api/pacientes error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const e = await currentService.getByIdAsync(id);
    if (!e) return res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
    const { contrasena, password, ...safe } = e;
    res.status(StatusCodes.OK).json(safe);
  } catch (error) {
    console.error('GET /api/pacientes/:id error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

// LOGIN (sin JWT por ahora)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email y password son requeridos.' });
    }

    const paciente = await currentService.getByEmailAsync(String(email).trim().toLowerCase());
    if (!paciente) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Credenciales inválidas.' });
    }

    const stored = paciente.contrasena ?? paciente.password ?? '';
    const ok = String(stored) === String(password);
    if (!ok) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Credenciales inválidas.' });
    }

    const { contrasena, password: _pwd, ...safeUser } = paciente;

    // Si querés JWT más tarde:
    // const token = jwt.sign({ sub: paciente.id, role: 'paciente' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // return res.status(StatusCodes.OK).json({ user: safeUser, token });

    return res.status(StatusCodes.OK).json({ user: safeUser });
  } catch (error) {
    console.error('Error en /api/pacientes/login:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

// CREAR (ocultando contrasena en la respuesta)
router.post('', async (req, res) => {
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

    const paciente = await currentService.createAsync(entity);
    if (paciente && ('contrasena' in paciente)) delete paciente.contrasena;
    if (paciente && ('password' in paciente)) delete paciente.password;
    res.status(StatusCodes.CREATED).json(paciente);
  } catch (error) {
    if (error?.code === '23505' && String(error?.constraint).includes('pacientes_email_key')) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'El email ya está registrado.' });
    }
    console.error('POST /api/pacientes error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

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
    if (!rowsAffected) return res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${entity.id}).`);
    res.status(StatusCodes.OK).json(rowsAffected);
  } catch (error) {
    console.error('PUT /api/pacientes error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const rowCount = await currentService.deleteByIdAsync(id);
    if (!rowCount) return res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
    res.status(StatusCodes.OK).json(rowCount);
  } catch (error) {
    console.error('DELETE /api/pacientes/:id error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error interno.' });
  }
});

export default router;
