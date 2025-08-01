// token.js
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

export function generateResetToken(email) {
  return jwt.sign({ email }, SECRET, { expiresIn: '15m' }); // expira en 15 minutos
}

export function verifyResetToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
