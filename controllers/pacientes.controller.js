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

export default { createPaciente, upload_information};