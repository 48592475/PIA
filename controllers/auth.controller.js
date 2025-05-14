const SignUp = async (req, res) => {
    const medico = req.body;
    const camposObligatorios = ["dni", "nombre", "apellido", "descripcion", "email", "experiencia"];

    const camposNecesarios = camposObligatorios.filter(obligatorio => !medico[obligatorio]);

    if (camposNecesarios.length > 0){
        return res.status(400).json({
            message: `Faltan completar los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`
        });
    }
    try {
    }
}