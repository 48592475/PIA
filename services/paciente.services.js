import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;

const createPaciente = async (paciente) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "INSERT INTO pacientes_sangre (nombre, apellido, edad, nacimiento, sexo, dni, archivo, descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [paciente.nombre, paciente.apellido, paciente.dni, paciente.email, paciente.password]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};
  

export default { createPaciente};