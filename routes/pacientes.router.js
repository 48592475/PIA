import express from "express"
import axios from "axios"
import pkg from "pg"
import { config } from "../db.js"
import pacientesController from "../controllers/pacientes.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// URLs correctas del predictor
const URL_PREDICTOR_SANGRE = process.env.URL_PREDICTOR
const URL_PREDICTOR_IMAGEN = process.env.URL_PREDICTOR_IMG

const { Pool } = pkg
const pool = new Pool({
  ...config,
  ssl: { rejectUnauthorized: false },
})

// ---------------------------
//   PREDICCIÓN DE SANGRE
// ---------------------------
router.post("/predict", verifyToken, async (req, res) => {
  try {
    const body = req.body;

    // Completar automáticamente sex_F y sex_M
    body.sex_F = body.sex_F === true;
    body.sex_M = body.sex_M === true;

    // Si no vino ninguno, error
    if (!body.sex_F && !body.sex_M) {
      return res.status(400).json({
        message: "Missing fields: sex_F or sex_M"
      });
    }

    // Validar campos obligatorios
    const camposObligatorios = [
      "nombre", "apellido", "lugar_nacimiento", "age", "dni",
      "plasma_CA19_9", "creatinine", "LYVE1", "REG1B", "TFF1",
      "REG1A", "CEA", "THBS"
    ];

    const camposFaltantes = camposObligatorios.filter(
      campo => !body[campo] && body[campo] !== 0
    );

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        message: `Missing fields: ${camposFaltantes.join(", ")}`
      });
    }

    // Verificar DNI duplicado
    const existing = await pool.query(
      "SELECT * FROM pacientes WHERE dni = $1",
      [body.dni]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "That ID is already registered."
      });
    }

    // Llamada a IA
    const response = await axios.post(
      URL_PREDICTOR_SANGRE,
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    const prediction = response.data.prediction;

    // Guardar en base de datos
    const query = `
      INSERT INTO pacientes(
        nombre, apellido, lugar_nacimiento, age, dni,
        plasma_ca19_9, creatinine, lyve1, reg1b, tff1,
        reg1a, cea, thbs, sex_f, sex_m, prediccion, user_id
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *;
    `;

    const values = [
      body.nombre, body.apellido, body.lugar_nacimiento, body.age,
      body.dni, body.plasma_CA19_9, body.creatinine, body.LYVE1,
      body.REG1B, body.TFF1, body.REG1A, body.CEA, body.THBS,
      body.sex_F, body.sex_M, prediction, req.userId
    ];

    const result = await pool.query(query, values);

    res.json({
      prediction,
      saved: result.rows[0],
      message: "Patient created successfully with AI prediction"
    });

  } catch (error) {
    console.error("Error predictor:", error.response?.data || error);
    res.status(500).json({
      error: "Prediction or DB save error",
      details: error.message
    });
  }
});

// ----------------------------
//   OTRAS RUTAS EXISTENTES
// ----------------------------
router.post("/create_paciente", verifyToken, pacientesController.createPaciente)
router.get("/get_pacients_by_id", verifyToken, pacientesController.getPacientesByUser)
router.post("/upload_sangre", pacientesController.upload_information)
router.post("/save_resultado_ia", pacientesController.save_resultado_ia)
router.post("/subir_imagen", verifyToken, upload.single("imagen"), pacientesController.uploadRadiografia)
router.get("/radiografias", pacientesController.getAllRadiografias)

export default router
