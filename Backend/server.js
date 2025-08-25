import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Routers
import EspecialidadesController from './controllers/especialidades-controller.js';
import PacientesController from './controllers/pacientes-controller.js';
import ResenasController from './controllers/resenas-controller.js';
import TurnosController from './controllers/turnos-controller.js';
import ProfesionalesController from './controllers/profesionales-controller.js';

const app = express();
const port = process.env.PORT ?? 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use('/api/especialidades', EspecialidadesController);
app.use('/api/pacientes', PacientesController);
app.use('/api/resenas', ResenasController);
app.use('/api/turnos', TurnosController);
app.use('/api/profesionales', ProfesionalesController);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
