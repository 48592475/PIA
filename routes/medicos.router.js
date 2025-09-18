const router = express.Router();
import express from "express";
import authController from "../controllers/medico.controllers.js";


router.post("/update_medico", authController.updateMedico);

export default router;
