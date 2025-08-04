import express from "express";
import routes from "./routes.js"

const app = express();
const port = 3000;

app.use(express.json())
app.use("/", routes)
app.listen(port, () => { // Inicio el servidor WEB (escuchar)
console.log(` Listening on http://localhost:${port}`)})


