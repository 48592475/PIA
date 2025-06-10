import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (to, token) => {
  const email = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pancreasartificialintelligence@gmail.com", 
      pass: "kyqd viqs xbfd mmmi", 
    },
  });

  const resetLink = `https://tuapp.com/reset-password/${token}`;

  const mailOptions = {
    from: "PIA<tuemail@gmail.com>",
    to,
    subject: "Restablecer contraseña",
    html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  };

  await email.sendMail(mailOptions);
};