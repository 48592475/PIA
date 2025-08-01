import express from "express";
import pacientesController from "../controllers/pacientes.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create_paciente", verifyToken, pacientesController.createPaciente);
router.get("/get_pacients_by_id", verifyToken, pacientesController.getPacientesByUser)
router.post("/upload_sangre", pacientesController.upload_information);
router.post("/save_resultado_ia", pacientesController.save_resultado_ia);
// router.post("/radiografia", uploadsingle("radiografia"), pacientesController.uploadRadiografia);

export default router;
