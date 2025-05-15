import usuariosServices from "../services/usuarios.services.js";

const SignUp = async (req, res) => {
    const medico = req.body;
    const camposObligatorios = ["dni", "nombre", "apellido", "descripcion", "email", "experiencia"];

    const camposFaltantes = camposObligatorios.filter(campo => !medico[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({
            message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`
        });
    }

    try {
        await usuariosServices.createUsuario(medico);
        return res.status(201).json({ message: "Felicitaciones, te has registrado de forma exitosa en PIA." });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        return res.status(500).json({ message: error.message });
    }
};

export default { SignUp };