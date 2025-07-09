import pacientesServices from "../services/paciente.services.js";
import bcrypt from "bcryptjs";

const createPaciente = async (req, res) => {
    const pacientes = req.body;
    const camposObligatorios = ["age", "diagnosis", "plasma_CA19_9", "creatinine", "LYVE1", "REG1B", "TFF1", "REG1A", "sex_F", "sex_M", "CEA", "THBS"];

    const camposFaltantes = camposObligatorios.filter(campo => !pacientes[campo]);

    if (camposFaltantes.length > 0){
        return res.status(400).json({message: `The following mandatory fields remain to be completed: ${camposFaltantes.join(', ')}`});
    }
    try {
        await pacientesServices.createPaciente(pacientes);
        return res.status(201).json({ message: "Congratulations, you have successfully create a Patient." });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: error.message });
    }
};
export default { createPaciente};