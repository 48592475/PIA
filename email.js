import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (to, token) => {
  const email = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pancreasartificialintelligence@gmail.com", 
      pass: "kyqd viqs xbfd mmmi", 
    },
  });

  const resetLink = `https://pia-front.vercel.app/updatepassword/?token=${token}`

  const mailOptions = {
    from: "PIA<tuemail@gmail.com>",
    to,
    subject: "Restablecer contraseña",
    html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  };

  await email.sendMail(mailOptions);
};
export const Welcome = async (to) => {
  const welcome = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pancreasartificialintelligence@gmail.com", 
      pass: "kyqd viqs xbfd mmmi", 
    },
  });

  const welcomeEmail = {
    from: "PIA <tuemail@gmail.com>",
    to,
    subject: "Registro Exitoso en PIA",
    html: `<p>Bienvenido, Muchisimas Gracias por confiar en nosotros, ahora a disfrutar de PIA. Cualquier duda podes contactarnos en: pancreasartificialintelligence@gmail.com</p>`,
  };

  await welcome.sendMail(welcomeEmail);
};