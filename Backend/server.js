    import 'dotenv/config'
    import express 	from "express";	
    import cors 	from "cors";	

    // Routers

    import EspecialidadesController   from "./controllers/especialidades-controller.js"
    import PacientessController     from "./controllers/pacientes-controller.js"
    /*
    import MedicamentosController     from "./controllers/medicamentos-controller.js"
    import RecetasController     from "./controllers/recetas-controller.js"
    import SolicitudesController     from "./controllers/solicitudes-controller.js"
    */
    import ReseñasController     from "./controllers/resenas-controller.js"
    import TurnosController     from "./controllers/turnos-controller.js"
    import ProfesionalesController     from "./controllers/profesionales-controller.js"

    const app  = express();
    const port = process.env.PORT ?? 3000;

    // Agrego los Middlewares
    app.use(cors());         // Middleware de CORS
    app.use(express.json()); // Middleware para parsear y comprender JSON
    
    // Endpoints (todos los Routers)

    app.use("/api/especialidades", EspecialidadesController);
    app.use("/api/pacientes", PacientessController);
    /*
    app.use("/api/medicamentos" , MedicamentosController);
    app.use("/api/recetas", RecetasController);
    app.use("/api/solicitudes", SolicitudesController);
    */
    app.use("/api/resenas" , ReseñasController);
    app.use("/api/turnos" , TurnosController);
    app.use("/api/profesionales" , ProfesionalesController);

    //
    // Inicio el Server y lo pongo a escuchar.
    //
    app.listen(port, () => {	// Inicio el servidor WEB (escuchar)
        console.log("server Controllers/Services/Repositories con SupabaseClient");
        console.log(`Listening on http://localhost:${port}`)
    })
    