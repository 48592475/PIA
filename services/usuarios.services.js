import { config } from "../db.js";
import pkg from "pg";
import crypto from "crypto";
const { Client } = pkg;

const getUser = async (dni) => {
  const client = new Client(config);
  await client.connect();
  try {
    const { rows } = await client.query("SELECT * FROM medico WHERE dni = $1", [dni]);
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
  } finally {
    await client.end();
  }
};

const getUserByEmail = async (email) => {
  const client = new Client(config);
  await client.connect();
  try {
    const { rows } = await client.query("SELECT * FROM medico WHERE email = $1", [email]);
    return rows[0];
  } finally {
    await client.end();
  }
};

const updatePasswordByEmail = async (email, password) => {
  const client = new Client(config);
  await client.connect();
  try {
    await client.query("UPDATE medico SET password = $1 WHERE email = $2", [password, email]);
    return true;
  } finally {
    await client.end();
  }
};

// === NUEVOS MÉTODOS PARA TOKEN DE RECUPERACIÓN ===

const saveResetToken = async (email, token, expiresAt) => {
  const client = new Client(config);
  await client.connect();
  try {
    await client.query("DELETE FROM password_reset_tokens WHERE email = $1", [email]);
    await client.query(
      "INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)",
      [email, token, expiresAt]
    );
  } finally {
    await client.end();
  }
};

const getResetToken = async (token) => {
  const client = new Client(config);
  await client.connect();
  try {
    const now = new Date();
    const { rows } = await client.query(
      "SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > $2",
      [token, now]
    );
    return rows[0];
  } finally {
    await client.end();
  }
};

const deleteResetToken = async (token) => {
  const client = new Client(config);
  await client.connect();
  try {
    await client.query("DELETE FROM password_reset_tokens WHERE token = $1", [token]);
    return true;
  } finally {
    await client.end();
  }
};

export default {
  createUsuario,
  getUser,
  getUserByDniAndEmail,
  updatePassword,
  getUserByEmail,
  updatePasswordByEmail,
  saveResetToken,
  getResetToken,
  deleteResetToken
};
