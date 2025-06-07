import usuariosServices from "../services/usuarios.services.js";
import bcrypt from "bcryptjs";
const SignUp = async (req, res) => {
    const user = req.body;
    const camposObligatorios = ["nombre", "apellido", "dni", "email", "password"];

    const camposFaltantes = camposObligatorios.filter(campo => !user[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({
            message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`
        });
    }
    try {
        const document = await usuariosServices.getUser(user.dni);
        if (document){
            return res.status(400).json({message : "Ese DNI ya fue ingresado, porfavor ingrese otro o verifique sus datos."})
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await usuariosServices.createUsuario(user);
        return res.status(201).json({ message: "Felicitaciones, te has registrado de forma exitosa en PIA." });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        return res.status(500).json({ message: error.message });
    }
};

const SignIn = async (req, res) => {
    const login = req.body;
    const camposObligatorios = ["dni", "password"];

    const camposFaltantes = camposObligatorios.filter(campo => !login[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({
            message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`
        });
    }
    try{
        const user = await usuariosServices.getUser(login.dni);
        if (!user && !passwordCorrect){
            return res.status(400).json({message : "No hay ningun registro con ese DNI, porfavor verifique sus datos."})
        }
        const passwordCorrect = await bcrypt.compare(login.password, user.password);
        if(!passwordCorrect){
            return res.status(400).json({message : "Contraseña incorrecta, porfavor verifique sus datos"})
        }
        return res.status(200).json ({message : "Inicio de sesion exitoso, bienvenido a PIA"});
    }catch (error){
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ message: error.message });
    }
};

export default { SignUp, SignIn};