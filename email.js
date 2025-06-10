import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (to, token) => {
  const email = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sendyktobias@gmail.com", 
      pass: "jing nfzf wybc hrsh", 
    },
  });

  const resetLink = `https://tuapp.com/reset-password/${token}`;

  const mailOptions = {
    from: "Tu App <tuemail@gmail.com>",
    to,
    subject: "Restablecer contraseña",
    html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  };

  await email.sendMail(mailOptions);
};