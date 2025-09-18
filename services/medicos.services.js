import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;

export const getMedicoByDni = async (dni) => {
  const client = new Client(config);
  await client.connect();

  try {
    const query = `
      SELECT dni, hospital, descripcion, experiencia
      FROM medico
      WHERE dni = $1
    `;
    const { rows } = await client.query(query, [dni]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error obteniendo médico:", error);
    throw error;
  } finally {
    await client.end();
  }
};

export const updateMedicoByDni = async (dni, { hospital, descripcion, experiencia }) => {
  const client = new Client(config);
  await client.connect();

  try {
    const query = `
      UPDATE medico
      SET hospital = $1,
          descripcion = $2,
          experiencia = $3
      WHERE dni = $4
      RETURNING dni, hospital, descripcion, experiencia
    `;
    const params = [hospital, descripcion, experiencia, dni];
    const { rows } = await client.query(query, params);
    return rows[0] || null;
  } catch (error) {
    console.error("Error actualizando médico:", error);
    throw error;
  } finally {
    await client.end();
  }
};
export default {getMedicoByDni, updateMedicoByDni};