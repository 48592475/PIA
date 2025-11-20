import { config } from "../db.js"
import pkg from "pg"
const { Client } = pkg

const createPaciente = async (paciente) => {
  const client = new Client(config)
  await client.connect()

  try {
    const { rows } = await client.query(
      "INSERT INTO pacientes (nombre, apellido, age, sexo, lugar_nacimiento, dni, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        paciente.nombre,
        paciente.apellido,
        paciente.age,
        paciente.sexo,
        paciente.lugar_nacimiento,
        paciente.dni,
        paciente.user_id,
      ],
    )
    return rows[0]
  } catch (error) {
    throw error
  } finally {
    await client.end()
  }
}

const createPacienteWithPrediction = async (pacienteData, prediction, userId) => {
  const client = new Client(config)
  await client.connect()

  try {
    const { rows } = await client.query(
      `INSERT INTO pacientes (
                nombre, apellido, lugar_nacimiento, age, dni, plasma_ca19_9, creatinine, 
                lyve1, reg1b, tff1, reg1a, cea, thbs, sex_f, sex_m, prediccion, user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
            RETURNING *`,
      [
        pacienteData.nombre,
        pacienteData.apellido,
        pacienteData.lugar_nacimiento,
        pacienteData.age,
        pacienteData.dni,
        pacienteData.plasma_CA19_9,
        pacienteData.creatinine,
        pacienteData.LYVE1,
        pacienteData.REG1B,
        pacienteData.TFF1,
        pacienteData.REG1A,
        pacienteData.CEA,
        pacienteData.THBS,
        pacienteData.sex_F,
        pacienteData.sex_M,
        prediction,
        userId,
      ],
    )
    return rows[0]
  } catch (error) {
    throw error
  } finally {
    await client.end()
  }
}

const getPaciente = async (dni) => {
  const client = new Client(config)
  await client.connect()
  try {
    const { rows } = await client.query("SELECT * FROM pacientes WHERE dni = $1", [dni])
    return rows[0]
  } finally {
    await client.end()
  }
}

const upload_analisis_sangre = async (paciente) => {
  const client = new Client(config)
  await client.connect()

  try {
    const { rows } = await client.query(
      `UPDATE pacientes 
             SET diagnosis = $1,
                 plasma_ca19_9 = $2,
                 creatinine = $3,
                 lye1 = $4,
                 reg1b = $5,
                 tff1 = $6,
                 reg1a = $7,
                 sex_f = $8,
                 sex_m = $9,
                 cea = $10,
                 thbs = $11
             WHERE dni = $12
             RETURNING *`,
      [
        paciente.diagnosis,
        paciente.plasma_ca19_9,
        paciente.creatinine,
        paciente.lye1,
        paciente.reg1b,
        paciente.tff1,
        paciente.reg1a,
        paciente.sex_f,
        paciente.sex_m,
        paciente.cea,
        paciente.thbs,
        paciente.dni,
      ],
    )
    return rows[0]
  } catch (error) {
    throw error
  } finally {
    await client.end()
  }
}

const guardarResultadoIA = async (resultado_ia) => {
  const client = new Client(config)
  await client.connect()

  try {
    const { rows } = await client.query(`INSERT INTO resultados_ia (resultado) VALUES ($1) RETURNING *`, [resultado_ia])
    return rows[0]
  } catch (error) {
    throw error
  } finally {
    await client.end()
  }
}

const guardarRadiografia = async (dni, radiografia, resultadoIA) => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query(
      `INSERT INTO radiografias (radiografia, dni, resultado_ia)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [radiografia, dni, resultadoIA]
    );

    return rows[0];

  } finally {
    await client.end();
  }
};

const getPacientesByUserId = async (userId) => {
  const client = new Client(config)
  await client.connect()

  try {
    const query = `
        SELECT 
            nombre, 
            apellido, 
            age, 
            lugar_nacimiento, 
            dni,
            prediccion
        FROM pacientes
        WHERE user_id = $1
        ORDER BY id DESC
    `


    const { rows } = await client.query(query, [userId])
    return rows
  } finally {
    await client.end()
  }
}

const getAllRadiografias = async () => {
  const client = new Client(config);
  await client.connect();

  try {
    const { rows } = await client.query(
      "SELECT dni, radiografia FROM radiografias ORDER BY id DESC"
    );

    return rows;
  } finally {
    await client.end();
  }
};


export default {
  createPaciente,
  createPacienteWithPrediction, // Added new service
  getPaciente,
  upload_analisis_sangre,
  guardarResultadoIA,
  guardarRadiografia,
  getPacientesByUserId,
  getAllRadiografias
}
