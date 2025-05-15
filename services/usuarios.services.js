import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;

const createUsuario = async (medico) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "INSERT INTO Medico (dni, nombre, apellido, descripcion, email, experiencia) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [medico.dni, medico.nombre, medico.apellido, medico.descripcion, medico.email, medico.experiencia]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};

export default { createUsuario };