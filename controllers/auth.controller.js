import usuariosServices from "../services/usuarios.services.js";
import bcrypt from "bcryptjs";
import { generateResetToken } from "../token.js";
import { sendResetPasswordEmail } from "../email.js";
import { Welcome } from "../email.js";

const SignUp = async (req, res) => {
    const user = req.body; //Lo que hace aca es guardar toda la informacion que mando el usuario, en este usuario su nombre, apellido, dni, email y password
    const camposObligatorios = ["nombre", "apellido", "dni", "email", "password"]; //Aqui lo que se hace es crear una lista con los campos obligatorios y segun lo que ingrese el usuario lo guarda en la variable campos obligatorios

    const camposFaltantes = camposObligatorios.filter(campo => !user[campo]); //Aqui chequea si falta completar algunos de estos campos, si falta lo agrega a la variable campos faltantes

    if (camposFaltantes.length > 0){
        return res.status(400).json({message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`});
    } //Aca lo que hace es chequear si campos faltantes  es mayor a 0 y si es asi le envia una respuesta de tipo 400 en la que le dice que falta ccompletar un campo, y cual es el restante
    try {
        const document = await usuariosServices.getUser(user.dni);//Aca lo que hace es nombrar a la variable document, en la que le dice que debe llamar a la funcion get user la cual se va a encaargar de chequear que ese usuario exista en la base de datos (DNI)
        if (document){
            return res.status(400).json({message : "Ese DNI ya fue ingresado, porfavor ingrese otro o verifique sus datos."})
        }//Aca chequeaa si ya hay un usuario con ese DNI y si es asi, le tira una rta de tipo 400 diciendole que ya existe una cuenta registrada con ese documento
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword; //Aca lo que hace es agarrar la contraseña que ingreso el usuario, y la hashea, 10 veces para que sea mas segura e imposible de descubrirla en caso de un robo de la base de datos
        await usuariosServices.createUsuario(user);//Si todo es correcto llama a la funcion ccccreada en el service de create usuario, y lo crea en la base de datos
        await Welcome(user.email);//Aca llama a la funcion welcome de el archivo email.js el cual se va a encargar de enviarle al mail ingresado por el usuario de que su registro fue exitoso
        return res.status(201).json({ message: "Felicitaciones, te has registrado de forma exitosa en PIA." });//Aca le brinda una respuesta de tipo 201, en la que le da el mensaje de que el registro fue exitoso, sumado al mail que le va a llegar al usuario.
        
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
        return res.status(400).json({message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`});
    }
    try{
        const user = await usuariosServices.getUser(login.dni);
        if (!user){
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

const Forgot_Password = async (req, res) => {
  const { dni, email } = req.body;

  if (!dni || !email) {
    return res.status(400).json({ message: "DNI y Email son obligatorios." });
  }

  try {
    const user = await usuariosServices.getUserByDniAndEmail(dni, email);
    if (!user) {
      return res.status(400).json({ message: "No existe un usuario con esos datos." });
    }

    const token = generateResetToken(dni, email);

    await sendResetPasswordEmail(email, token);

    return res.status(200).json({ message: "Correo enviado para restablecer la contraseña." });

  } catch (error) {
    console.error("Error al enviar mail:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
const Update_Password = async (req, res) => {
  const update_password = req.body;
  const camposObligatorios = ["password"];

  const camposFaltantes = camposObligatorios.filter(campo => !update_password[campo]);
  if (camposFaltantes.length > 0){
        return res.status(400).json({message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`});
    }

  try {
    const hashedContra = await bcrypt.hash(contraseña, 10);
    await usuariosService.actualizarContraseña(usuario, hashedContra);
    return res.status(200).json({ message: "Contraseña actualizada de forma correcta" });
  } catch (error) {
    console.error("Error al enviar mail:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};


export default { SignUp, SignIn, Forgot_Password, Update_Password};