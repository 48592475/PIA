import medicosServices from "../services/medicos.services.js";

export const updateMedico = async (req, res) => {
  try {
    const { dni } = req.params;
    const { hospital, descripcion, experiencia } = req.body;

    if (!dni) {
      return res.status(400).json({ message: "El DNI es obligatorio." });
    }

    const camposObligatorios = ["hospital", "descripcion", "experiencia"];
    const faltantes = camposObligatorios.filter(c => !req.body[c]);
    if (faltantes.length > 0) {
      return res.status(400).json({
        message: `Faltan completar: ${faltantes.join(", ")}`
      });
    }

    const medico = await medicosServices.getMedicoByDni(dni);
    if (!medico) {
      return res.status(404).json({ message: "No existe un médico con ese DNI." });
    }

    const actualizado = await medicosServices.updateMedicoByDni(dni, {
      hospital,
      descripcion,
      experiencia
    });

    return res.status(200).json({
      message: "Médico actualizado correctamente.",
      data: actualizado
    });
  } catch (error) {
    console.error("Error actualizando médico:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
export default { updateMedico};
