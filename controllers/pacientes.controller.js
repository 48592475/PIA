import pacientesServices from "../services/paciente.services.js";

const createPaciente = async (req, res) => {
    const pacientes = req.body;
    const camposObligatorios = ["nombre", "apellido", "age", "sexo", "lugar_nacimiento", "dni"];

    const camposFaltantes = camposObligatorios.filter(campo => !pacientes[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({message: `The following mandatory fields remain to be completed: ${camposFaltantes.join(', ')}`});
    }
    try {
        const document = await pacientesServices.getPaciente(pacientes.dni);
                if (document){
                    return res.status(400).json({message : "That ID has already been entered, please enter another one or verify your information."})
                }
        await pacientesServices.createPaciente(pacientes);
        return res.status(201).json({ message: "Congratulations, you have successfully create a Patient." });
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
const uploadRadiografia = async (req, res) => {
    const { dni } = req.body;
    const imagen = req.file;

    if (!dni || !imagen) {
        return res.status(400).json({ message: "DNI and image file are required." });
    }

    try {
        const paciente = await pacientesServices.getPaciente(dni);
        if (!paciente) {
            return res.status(404).json({ message: "No patient found with the provided DNI." });
        }

        await pacientesServices.guardarRadiografia(dni, imagen.buffer);
        return res.status(201).json({ message: "Radiography uploaded successfully." });
    } catch (error) {
        console.error("Error uploading radiography:", error);
        return res.status(500).json({ message: error.message });
    }
};
export default { createPaciente, upload_information, save_resultado_ia, uploadRadiografia};