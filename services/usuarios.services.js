import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;

const getPassword = async (medico) => {
    const client = new Client(config);
    await client.connect();
    try{
        const {rows} = await client.query(
            "SELECT * FROM medico WHERE password = $1",
            [medico.password]
        );
        return rows.length > 0 ? rows  [0] : null;
    }catch(error){
        throw error;
    }finally{
        await client.end();
    }
}

const getDocument = async (dni) => {
  const client = new Client(config);
  await client.connect();
  try {
    const { rows } = await client.query(
      "SELECT * FROM medico WHERE dni = $1",
      [dni]
    );
    return rows[0];
  } finally {
    await client.end();
  }
};

const createUsuario = async (medico) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "INSERT INTO medico (nombre, apellido, dni, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [medico.nombre, medico.apellido, medico.dni, medico.email, medico.password]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
};

export default { createUsuario, getPassword, getDocument };