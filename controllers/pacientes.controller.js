import pacientesServices from "../services/paciente.services.js";

const createPaciente = async (req, res) => {
    const pacientes = req.body;
    const camposObligatorios = ["nombre", "apellido", "age", "lugar_nacimiento", "dni"];

    const camposFaltantes = camposObligatorios.filter(campo => !pacientes[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({
            message: `The following mandatory fields remain to be completed: ${camposFaltantes.join(', ')}`
        });
    }

    try {
        const document = await pacientesServices.getPaciente(pacientes.dni);
        if (document){
            return res.status(400).json({
                message: "That ID has already been entered, please enter another one or verify your information."
            });
        }

        // 👇🏻 Agregamos el ID del usuario logueado
        pacientes.user_id = req.userId;

        await pacientesServices.createPaciente(pacientes);
        return res.status(201).json({
            message: "Congratulations, you have successfully created a Patient."
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: error.message });
    }
};

const upload_information = async (req, res) => {
    const pacientes = req.body;
    const camposObligatorios = ["dni", "diagnosis", "plasma_ca19_9", "creatinine", "lye1", "reg1b", "tff1", "reg1a", "sex_f", "sex_m", "cea", "thbs"];

    const camposFaltantes = camposObligatorios.filter(campo => !pacientes[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({message: `The following mandatory fields remain to be completed: ${camposFaltantes.join(', ')}`});
    }

    try {
        const existingPaciente = await pacientesServices.getPaciente(pacientes.dni);
        if (!existingPaciente) {
            return res.status(404).json({message : "No patient found with the provided DNI."});
        }

        await pacientesServices.upload_analisis_sangre(pacientes);
        return res.status(201).json({ message: "Patient analysis information successfully uploaded." });
    } catch (error) {
        console.error("Error uploading analysis information:", error);
        return res.status(500).json({ message: error.message });
    }
};
const save_resultado_ia = async (req, res) => {
    const { resultado_ia } = req.body;

    if (!resultado_ia) {
        return res.status(400).json({ message: "'resultado_ia' is required." });
    }

    try {
        await pacientesServices.guardarResultadoIA(resultado_ia);
        return res.status(201).json({ message: "AI result saved without DNI." });
    } catch (error) {
        console.error("Error saving AI result:", error);
        return res.status(500).json({ message: error.message });
    }
};
export const uploadRadiografia = async (req, res) => {
  try {
    const { dni } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No se envió ninguna imagen" });
    }

    if (!dni) {
      return res.status(400).json({ message: "No se envió el DNI del paciente" });
    }

    // ===== 1. Mandar imagen a la IA =====
    const formData = new FormData();
    formData.append("file", new Blob([file.buffer]), file.originalname);

    const response = await axios.post("https://proyecto-pia-2025.onrender.com/predict-image", formData, {
      headers: formData.getHeaders()
    });

    const iaResult = response.data.prediction; // "normal" o "pancreatic_tumor"

    // ===== 2. Guardar en la DB =====
    const nuevaRadiografia = await pacientesServices.guardarRadiografia(
      dni,
      file.buffer,
      iaResult
    );

    res.status(200).json({
      message: "Radiografía subida correctamente",
      radiografia: nuevaRadiografia,
      ia: iaResult
    });

  } catch (error) {
    console.error("Error al subir radiografía:", error);
    res.status(500).json({ message: "Error interno d213el servidor", error });
  }
};

const getPacientesByUser = async (req, res) => {
  try {
    const userId = req.userId; // Este valor lo pone `verifyToken`
    console.log('User ID recibido:', userId);

    const pacientes = await pacientesServices.getPacientesByUserId(userId);
    console.log('Pacientes encontrados:', pacientes);

    return res.status(200).json(pacientes);
  } catch (error) {
    console.error('Error en getPacientesByUser:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllRadiografias = async (req, res) => {
  try {
    const radiografias = await pacientesServices.getAllRadiografias();

    // Convertimos cada imagen a base64
    const radiografiasBase64 = radiografias.map(r => ({
      dni: r.dni,
      imagen: `data:image/jpeg;base64,${r.radiografia.toString("base64")}`,
    }));

    return res.status(200).json(radiografiasBase64);
  } catch (error) {
    console.error("Error al obtener radiografías:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export default { createPaciente, upload_information, save_resultado_ia, uploadRadiografia, getPacientesByUser, getAllRadiografias};