import nodemailer from "nodemailer";

type WelcomeEmailInput = {
  nombre: string;
  email: string;
  password: string;
  role: string;
};

const GMAIL_APP_PASSWORD_LENGTH = 16;

function normalizeEnvValue(value?: string) {
  return value?.trim();
}

function normalizeGmailAppPassword(value?: string) {
  return value?.replace(/\s+/g, "").trim();
}

function getTransporter() {
  const user = normalizeEnvValue(process.env.GMAIL_USER);
  const pass = normalizeGmailAppPassword(process.env.GMAIL_APP_PASSWORD);

  if (!user || !pass) {
    throw new Error("Faltan GMAIL_USER o GMAIL_APP_PASSWORD en las variables de entorno.");
  }

  if (pass.length !== GMAIL_APP_PASSWORD_LENGTH) {
    throw new Error(
      "GMAIL_APP_PASSWORD no parece una App Password de Gmail valida. Usa la App Password de 16 caracteres, no una API key."
    );
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
  const from = normalizeEnvValue(process.env.GMAIL_USER);

  await transporter.sendMail({
    from,
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
