import express from "express"
import axios from "axios"
import pkg from "pg"
import { config } from "../db.js"
import pacientesController from "../controllers/pacientes.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()
const URL_PREDICTOR = process.env.URL_PREDICTOR

const { Pool } = pkg
const pool = new Pool({
  ...config,
  ssl: { rejectUnauthorized: false },
})

router.post("/predict", verifyToken, async (req, res) => {
  try {
    const body = req.body

    // Validar campos obligatorios
    const camposObligatorios = [
      "nombre",
      "apellido",
      "lugar_nacimiento",
      "age",
      "dni",
      "plasma_CA19_9",
      "creatinine",
      "LYVE1",
      "REG1B",
      "TFF1",
      "REG1A",
      "CEA",
      "THBS",
      "sex_F",
      "sex_M",
    ]

    const camposFaltantes = camposObligatorios.filter(
      (campo) => body[campo] === undefined || body[campo] === null || body[campo] === "",
    )

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        message: `The following mandatory fields remain to be completed: ${camposFaltantes.join(", ")}`,
      })
    }

    // Verificar que el DNI no exista
    const existingPatient = await pool.query("SELECT * FROM pacientes WHERE dni = $1", [body.dni])
    if (existingPatient.rows.length > 0) {
      return res.status(400).json({
        message: "That ID has already been entered, please enter another one or verify your information.",
      })
    }

    // Llamamos a la IA
    const response = await axios.post(URL_PREDICTOR, body, {
      headers: { "Content-Type": "application/json" },
    })

    const prediction = response.data.prediction // 0 o 1

    const query = `
        INSERT INTO pacientes(
            nombre, apellido, lugar_nacimiento, age, dni, plasma_ca19_9, creatinine, 
            lyve1, reg1b, tff1, reg1a, cea, thbs, sex_f, sex_m, prediccion, user_id
        ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING *;
        `

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
      prediction,
      req.userId, // Added user_id from verifyToken middleware
    ]

    const result = await pool.query(query, values)

    res.json({
      prediction,
      saved: result.rows[0],
      message: "Patient created successfully with AI prediction",
    })
  } catch (error) {
    console.error("Error completo:", error.response ? error.response.data : error)
    res.status(500).json({
      error: "Error al obtener la predicción o guardar el paciente",
      details: error.message,
    })
  }
})

// Existing routes
router.post("/create_paciente", verifyToken, pacientesController.createPaciente)
router.get("/get_pacients_by_id", verifyToken, pacientesController.getPacientesByUser)
router.post("/upload_sangre", pacientesController.upload_information)
router.post("/save_resultado_ia", pacientesController.save_resultado_ia)
router.post("/subir_imagen", pacientesController.uploadRadiografia)

export default router
