const router = express.Router();
import express from "express";
import pacientesController from "../controllers/pacientes.controller.js";


router.post("/create_paciente", pacientesController.createPaciente);


export default router;
