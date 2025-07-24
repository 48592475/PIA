const router = express.Router();
import express from "express";
import pacientesController from "../controllers/pacientes.controller.js";


router.post("/create_paciente", pacientesController.createPaciente);
router.post("/upload_sangre", pacientesController.upload_information);
router.post("/save_resultado_ia", pacientesController.save_resultado_ia);
router.post("/radiografia", upload.single("radiografia"), pacientesController.uploadRadiografia);

export default router;
