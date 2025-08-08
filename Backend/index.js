import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
const port = 3000;

// Configurar CORS
app.use(cors({
  origin: '*', // En producción, especificar el dominio exacto
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📋 API endpoints disponibles:`);
  console.log(`   - POST /register (Registro de usuarios)`);
  console.log(`   - POST /login (Login de usuarios)`);
  console.log(`   - GET /profesionales (Obtener doctores)`);
  console.log(`   - POST /turnos (Crear turno)`);
  console.log(`   - GET /turnos/paciente/:id (Turnos de paciente)`);
  console.log(`   - GET /turnos/profesional/:id (Turnos de profesional)`);
  console.log(`   - DELETE /turnos/:id (Cancelar turno)`);
  console.log(`   - GET /especialidades (Obtener especialidades)`);
});


