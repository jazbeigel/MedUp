import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
const port = 3001;

// Configurar CORS
app.use(cors({
  origin: '*', // En producción, especificar el dominio exacto
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

app.use("/", routes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📋 API endpoints disponibles:`);
  console.log(`   - GET /health (Estado del servidor)`);
  console.log(`   - POST /register (Registro de usuarios)`);
  console.log(`   - POST /login (Login de usuarios)`);
  console.log(`   - GET /especialidades (Obtener especialidades)`);
});


