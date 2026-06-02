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

function getMailConfig() {
  const user = normalizeEnvValue(process.env.GMAIL_USER);
  const pass = normalizeGmailAppPassword(process.env.GMAIL_APP_PASSWORD);

  if (!user || !pass) {
    throw new Error("Faltan GMAIL_USER o GMAIL_APP_PASSWORD en las variables de entorno.");
  }

  if (pass.length !== GMAIL_APP_PASSWORD_LENGTH) {
    throw new Error(
      "La clave de correo no parece una App Password de Gmail valida. Usa la contrasena de aplicacion de 16 caracteres, no una API key."
    );
  }

  return { user, pass };
}

function getTransporter() {
  const { user, pass } = getMailConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildWelcomeEmailHtml({
  nombre,
  email,
  password,
  role
}: WelcomeEmailInput) {
  const safeNombre = escapeHtml(nombre);
  const safeEmail = escapeHtml(email);
  const safePassword = escapeHtml(password);
  const safeRole = escapeHtml(role);

  return `
    <div style="margin:0; padding:32px 16px; background-color:#f3f6fb;">
      <table role="presentation" style="width:100%; border-collapse:collapse;">
        <tr>
          <td align="center">
            <table
              role="presentation"
              style="width:100%; max-width:640px; border-collapse:separate; border-spacing:0; background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 18px 45px rgba(15, 23, 42, 0.12);"
            >
              <tr>
                <td
                  style="padding:40px 40px 32px; background:linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #38bdf8 100%); color:#ffffff;"
                >
                  <div style="font-family:Segoe UI, Arial, sans-serif; font-size:12px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; opacity:0.78;">
                    User Manager
                  </div>
                  <h1 style="margin:18px 0 12px; font-family:Segoe UI, Arial, sans-serif; font-size:32px; line-height:1.2; font-weight:800;">
                    Bienvenido, ${safeNombre}
                  </h1>
                  <p style="margin:0; font-family:Segoe UI, Arial, sans-serif; font-size:16px; line-height:1.7; color:rgba(255,255,255,0.88);">
                    Tu cuenta fue creada correctamente. Ya puedes ingresar a la plataforma con las credenciales asignadas.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px 16px;">
                  <div style="font-family:Segoe UI, Arial, sans-serif; font-size:15px; line-height:1.75; color:#334155;">
                    Este es el resumen de acceso de tu cuenta:
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 40px 8px;">
                  <table role="presentation" style="width:100%; border-collapse:separate; border-spacing:0 12px;">
                    <tr>
                      <td style="width:160px; padding:16px 18px; border-radius:16px; background-color:#eef4ff; font-family:Segoe UI, Arial, sans-serif; font-size:13px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#1d4ed8;">
                        Email
                      </td>
                      <td style="padding:16px 18px; border-radius:16px; background-color:#f8fafc; font-family:Segoe UI, Arial, sans-serif; font-size:15px; color:#0f172a;">
                        ${safeEmail}
                      </td>
                    </tr>
                    <tr>
                      <td style="width:160px; padding:16px 18px; border-radius:16px; background-color:#eefbf3; font-family:Segoe UI, Arial, sans-serif; font-size:13px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#15803d;">
                        Password temporal
                      </td>
                      <td style="padding:16px 18px; border-radius:16px; background-color:#f8fafc; font-family:'Courier New', monospace; font-size:15px; color:#0f172a;">
                        ${safePassword}
                      </td>
                    </tr>
                    <tr>
                      <td style="width:160px; padding:16px 18px; border-radius:16px; background-color:#fff4e8; font-family:Segoe UI, Arial, sans-serif; font-size:13px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#c2410c;">
                        Rol
                      </td>
                      <td style="padding:16px 18px; border-radius:16px; background-color:#f8fafc; font-family:Segoe UI, Arial, sans-serif; font-size:15px; color:#0f172a;">
                        ${safeRole}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px 8px;">
                  <div style="padding:18px 20px; border:1px solid #dbeafe; border-radius:18px; background-color:#f8fbff; font-family:Segoe UI, Arial, sans-serif; font-size:14px; line-height:1.7; color:#334155;">
                    Te recomendamos cambiar tu password temporal después del primer ingreso para mantener tu cuenta protegida.
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px 40px;">
                  <div style="font-family:Segoe UI, Arial, sans-serif; font-size:13px; line-height:1.7; color:#64748b;">
                    Este mensaje fue generado automáticamente por User Manager. Si no esperabas esta cuenta, responde a este correo para solicitar revisión.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function sendWelcomeEmail({
  nombre,
  email,
  password,
  role
}: WelcomeEmailInput) {
  const transporter = getTransporter();
  const { user: from } = getMailConfig();

  await transporter.sendMail({
    from,
    to: email,
    subject: "Bienvenido a User Manager",
    html: buildWelcomeEmailHtml({ nombre, email, password, role })
  });
}
