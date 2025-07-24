import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;

const createPaciente = async (paciente) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "INSERT INTO pacientes (nombre, apellido, age, sexo, lugar_nacimiento, dni) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [paciente.nombre, paciente.apellido, paciente.age, paciente.sexo, paciente.lugar_nacimiento, paciente.dni]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};

const getPaciente = async (dni) => {
  const client = new Client(config);
  await client.connect();
  try {
    const { rows } = await client.query(
      "SELECT * FROM pacientes WHERE dni = $1",
      [dni]
    );
    return rows[0];
  } finally {
    await client.end();
  }
};

const upload_analisis_sangre = async (paciente) => {
    const client = new Client(config);
    await client.connect();

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
            [paciente.diagnosis, paciente.plasma_ca19_9, paciente.creatinine, paciente.lye1, paciente.reg1b, paciente.tff1, paciente.reg1a, paciente.sex_f, paciente.sex_m, paciente.cea, paciente.thbs, paciente.dni]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};
const guardarResultadoIA = async (resultado_ia) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            `INSERT INTO resultados_ia (resultado) VALUES ($1) RETURNING *`,
            [resultado_ia]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};
const guardarRadiografia = async (dni, radiografia) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            `INSERT INTO radiografias (radiografia, dni) VALUES ($1, $2) RETURNING *`,
            [radiografia, dni]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};

export default { createPaciente, getPaciente, upload_analisis_sangre, guardarResultadoIA, guardarRadiografia};