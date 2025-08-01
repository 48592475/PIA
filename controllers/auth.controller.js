import usuariosServices from "../services/usuarios.services.js";
import bcrypt from "bcryptjs";
import { sendResetPasswordEmail, Welcome } from "../email.js";
import crypto from "crypto";
import jwt from 'jsonwebtoken'

const SignUp = async (req, res) => {
  const user = req.body;
  const camposObligatorios = ["nombre", "apellido", "dni", "email", "password"];

  const camposFaltantes = camposObligatorios.filter(campo => !user[campo]);
  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      message: `The following mandatory fields remain to be completed: ${camposFaltantes.join(', ')}`,
    });
  }

  try {
    const document = await usuariosServices.getUser(user.dni);
    if (document) {
      return res.status(400).json({
        message: "That ID has already been entered, please enter another one or verify your information.",
      });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    await usuariosServices.createUsuario(user);
    await Welcome(user.email);

    return res.status(201).json({
      message: "Congratulations, you have successfully registered with PIA.",
    });

  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: error.message });
  }
};

const SignIn = async (req, res) => {
  const login = req.body;
  const camposObligatorios = ["dni", "password"];
  const camposFaltantes = camposObligatorios.filter(campo => !login[campo]);

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      message: `The following mandatory fields remain to be completed: ${camposFaltantes.join(', ')}`,
    });
  }

  try {
    const user = await usuariosServices.getUser(login.dni);
    if (!user) {
      return res.status(400).json({
        message: "There is no record of that ID, please verify your details.",
      });
    }

    const passwordCorrect = await bcrypt.compare(login.password, user.password);
    if (!passwordCorrect) {
      return res.status(400).json({
        message: "Incorrect password, please verify your details.",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "5h" });
    console.log(token)
    return res.status(200).json({ 
      message: "Login successful, welcome to PIA.",
      token: token,
      fullName: `${user.nombre} ${user.apellido}`
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
};


const Forgot_Password = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await usuariosServices.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "There is no user with that email." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await usuariosServices.saveResetToken(email, token, expiresAt);
    await sendResetPasswordEmail(email, token);

    return res.status(200).json({ message: "Email sent to reset password." });

  } catch (error) {
    console.error("Error sending reset email:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const Update_Password = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required." });
  }

  try {
    const record = await usuariosServices.getResetToken(token);
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usuariosServices.updatePasswordByEmail(record.email, hashedPassword);

    await usuariosServices.deleteResetToken(token);  // <----- Aquí borras el token!

    return res.status(200).json({ message: "Password updated successfully." });

  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export default { SignUp, SignIn, Forgot_Password, Update_Password };
