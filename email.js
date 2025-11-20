import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pancreasartificialintelligence@gmail.com",
    pass: "kyqd viqs xbfd mmmi", // sería mejor poner esto en variables de entorno
  },
  tls: {
    // 👇 ESTO EVITA EL ERROR "self-signed certificate in certificate chain"
    rejectUnauthorized: false,
  },
});

// --------- Mail para resetear contraseña ----------
export const sendResetPasswordEmail = async (to, token) => {
  const resetLink = `https://pia-front.vercel.app/updatepassword/?token=${token}`;

  const mailOptions = {
    from: "PIA <pancreasartificialintelligence@gmail.com>",
    to,
    subject: "Restablecer contraseña",
    html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
};

// --------- Mail de bienvenida ----------
export const Welcome = async (to) => {
  const welcomeEmail = {
    from: "PIA <pancreasartificialintelligence@gmail.com>",
    to,
    subject: "Registro Exitoso en PIA",
    html: `<p>Bienvenido, muchísimas gracias por confiar en nosotros. 
           Ahora a disfrutar de PIA. Cualquier duda podés contactarnos en: 
           pancreasartificialintelligence@gmail.com</p>`,
  };

  await transporter.sendMail(welcomeEmail);
};
