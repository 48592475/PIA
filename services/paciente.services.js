import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;

const createPaciente = async (paciente) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "INSERT INTO pacientes_sangre (age, diagnosis, plasma_CA19_9, creatinine, LYVE1, REG1B, TFF1, REG1A, sex_F, sex_M, CEA, THBS) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
            [paciente.age, paciente.diagnosis, paciente.plasma_CA19_9, paciente.creatinine, paciente.LYVE1,paciente.REG1B, paciente.TFF1, paciente.REG1A, paciente.sex_F, paciente.sex_M, paciente.CEA, paciente.THBS]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};
  

export default { createPaciente};