import jwt from "jsonwebtoken";

const SECRET = "clave";

export const generateResetToken = (dni, email) => {
  return jwt.sign({ dni, email }, SECRET, { expiresIn: "15m" });
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, SECRET);
};