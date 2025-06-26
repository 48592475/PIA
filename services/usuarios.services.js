import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;

const getUser = async (dni) => {
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

const getUserByDniAndEmail = async (dni, email) => {
  const client = new Client(config);
  await client.connect();
  try {
    const { rows } = await client.query(
      "SELECT * FROM medico WHERE dni = $1 AND email = $2",
      [dni, email]
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
const updatePassword = async (dni, password) => {
    const client = new Client(config);
    await client.connect();
    try {
      const queryUpdate = `
        UPDATE medico
        SET password = $2
        WHERE dni = $1
      `;
      await client.query(queryUpdate, [dni, password]);
      return true;
    } catch (error) {
      throw error;
    } finally {
      await client.end();
    }
  };
  

export default { createUsuario, getUser, getUserByDniAndEmail, updatePassword };