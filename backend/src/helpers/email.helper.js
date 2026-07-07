import nodemailer from 'nodemailer';

export function buildMaintenanceEmail({ instructorName, vehicleMatricula, comment, nivelVencimiento }) {
  const safeName = instructorName || 'Instructor';
  const safeComment = comment || 'Sin comentarios adicionales.';
  const safeLevel = nivelVencimiento || 'No informado';

  return {
    subject: `Vehículo ${vehicleMatricula} enviado a mantenimiento`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2 style="color: #1d4ed8;">Notificación de mantenimiento</h2>
        <p>Hola ${safeName},</p>
        <p>El vehículo <strong>${vehicleMatricula}</strong> ha sido enviado a mantenimiento.</p>
        <p><strong>Comentario:</strong> ${safeComment}</p>
        <p><strong>Nivel de estado / vencimiento:</strong> ${safeLevel}</p>
        <p>Por favor, revisa la situación y coordina con la secretaría si es necesario.</p>
        <p>Gracias,<br/>Autoescuela</p>
      </div>
    `,
  };
}

export async function sendMaintenanceNotification({ to, instructorName, vehicleMatricula, comment, nivelVencimiento }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'autoescuela@example.com';

  if (!host || !user || !pass) {
    console.info(`[email] SMTP no configurado. Se omite el envío para ${to}`);
    return { ok: true, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const { subject, html } = buildMaintenanceEmail({ instructorName, vehicleMatricula, comment, nivelVencimiento });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return { ok: true, messageId: info.messageId, skipped: false };
}
