import express from "express";
import cors from "cors";
import "dotenv/config";
import dotenv from 'dotenv';
import usuarioRoutes from './routes/auth.router.js';
import pacientesRoutes from './routes/pacientes.router.js';
dotenv.config();
const web = express();

web.use(express.json());
web.use(cors());

web.use('/auth', usuarioRoutes);
web.use('/paciente', pacientesRoutes);

web.get("/", (_, res) => res.send("PIA API esta corriendo..."));

web.listen(process.env.PORT || 3001 , () => 
    console.log(`Servidor corriendo en puerto ${process.env.PORT || 3001}`)
)