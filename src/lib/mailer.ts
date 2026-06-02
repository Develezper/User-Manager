import nodemailer from "nodemailer";

type WelcomeEmailInput = {
  nombre: string;
  email: string;
  password: string;
  role: string;
};

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
}

export async function sendWelcomeEmail({
  nombre,
  email,
  password,
  role
}: WelcomeEmailInput) {
  const transporter = getTransporter();

  if (!transporter) {
    return;
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Bienvenido a User Manager",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2>Bienvenido, ${nombre}</h2>
        <p>Tu cuenta fue creada correctamente.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password temporal:</strong> ${password}</p>
        <p><strong>Rol:</strong> ${role}</p>
      </div>
    `
  });
}
