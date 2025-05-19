import usuariosServices from "../services/usuarios.services.js";
import bcrypt from "bcryptjs";
const SignUp = async (req, res) => {
    const medico = req.body;
    const camposObligatorios = ["nombre", "apellido", "dni", "email", "password"];

    const camposFaltantes = camposObligatorios.filter(campo => !medico[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({
            message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`
        });
    }
    try {
        const password = await usuariosServices.getPassword(medico.password);
        if (password){
            return res.status(400).json({message : "Esa contraseña ya fue utilizada, porfavor ingrese una nueva."})
        }
        const document = await usuariosServices.getDocument(medico.dni);
        if (document){
            return res.status(400).json({message : "Ese DNI ya fue ingresado, porfavor ingrese otro o verifique sus datos."})
        }
        const hashedPassword = await bcrypt.hash(medico.password, 10);
        medico.password = hashedPassword;
        await usuariosServices.createUsuario(medico);
        return res.status(201).json({ message: "Felicitaciones, te has registrado de forma exitosa en PIA." });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        return res.status(500).json({ message: error.message });
    }
};

export default { SignUp };