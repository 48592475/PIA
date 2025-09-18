const router = express.Router();
import express from "express";
import axios from "axios";
import pkg from "pg";
import { config } from "../db.js"
const URL_PREDICTOR = process.env.URL_PREDICTOR

import pacientesController from "../controllers/pacientes.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


router.post("/create_paciente", verifyToken, pacientesController.createPaciente);
router.get("/get_pacients_by_id", verifyToken, pacientesController.getPacientesByUser)
router.post("/upload_sangre", pacientesController.upload_information);
router.post("/save_resultado_ia", pacientesController.save_resultado_ia);


const { Pool } = pkg;
const pool = new Pool({
    ...config,
    ssl: { rejectUnauthorized: false } 
});

router.post("/predict", async (req, res) => {
    try {
        const body = req.body;

        // Llamamos a la IA
        const response = await axios.post(URL_PREDICTOR, body, {
            headers: { "Content-Type": "application/json" }
        });

            const prediction = response.data.prediction; // ahora es 0 o 1

        // Guardamos en la tabla pacientes
        const query = `
        INSERT INTO pacientes(
            nombre, apellido, lugar_nacimiento, age, dni, plasma_ca19_9, creatinine, lyve1, reg1b, tff1, reg1a, cea, thbs, sex_f, sex_m, prediccion
        ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING *;
        `;

        const values = [
            body.nombre,
            body.apellido,
            body.lugar_nacimiento,
            body.age,
            body.dni,
            body.plasma_CA19_9,
            body.creatinine,
            body.LYVE1,
            body.REG1B,
            body.TFF1,
            body.REG1A,
            body.CEA,
            body.THBS,
            body.sex_F,
            body.sex_M,
            prediction
        ];

        const result = await pool.query(query, values);

        res.json({ prediction, saved: result.rows[0] });
    } catch (error) {
    console.error("Error completo:", error.response ? error.response.data : error);
    res.status(500).json({ error: "Error al obtener la predicción o guardar el paciente", details: error.message });
    }
});

router.post("/create_paciente", verifyToken, pacientesController.createPaciente);
router.get("/get_pacients_by_id", verifyToken, pacientesController.getPacientesByUser)
export default router;


