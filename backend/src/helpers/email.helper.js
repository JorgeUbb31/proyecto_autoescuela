import nodemailer from 'nodemailer';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

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

export function buildInstructorPromotionEmail({ instructorName, specialization, instructorRut }) {
  const safeName = instructorName || 'Instructor';
  const safeSpecialization = specialization || 'Práctica de manejo';
  const safeRut = instructorRut || 'No informado';

  return {
    subject: 'Has sido promovido a instructor práctico de manejo',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2 style="color: #1d4ed8;">Promoción a instructor práctico</h2>
        <p>Hola ${safeName},</p>
        <p>Te informamos que has sido promovido a instructor práctico de manejo.</p>
        <p><strong>Especialización:</strong> ${safeSpecialization}</p>
        <p><strong>RUT:</strong> ${safeRut}</p>
        <p>Ya puedes empezar a gestionar tus asignaciones y vehículos desde la plataforma.</p>
        <p>Gracias,<br/>Autoescuela</p>
      </div>
    `,
  };
}

export function buildLicenseExpirationReminderEmail({ instructorName, licenceNumber, expiryDate, daysRemaining }) {
  const safeName = instructorName || 'Instructor';
  const safeNumber = licenceNumber || 'No disponible';
  const safeExpiry = expiryDate || 'sin fecha definida';
  const safeDays = typeof daysRemaining === 'number' ? `${daysRemaining} día${daysRemaining === 1 ? '' : 's'}` : 'menos de 30 días';

  return {
    subject: `Recordatorio de vencimiento de licencia: ${safeNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2 style="color: #1d4ed8;">Recordatorio de renovación de licencia</h2>
        <p>Hola ${safeName},</p>
        <p>Tu licencia con número <strong>${safeNumber}</strong> vence en <strong>${safeDays}</strong> el <strong>${safeExpiry}</strong>.</p>
        <p>Por favor, renueva tu licencia antes de esa fecha para seguir operando con normalidad.</p>
        <p>Si ya tienes el trámite en curso, ignora este mensaje.</p>
        <p>Gracias,<br/>Autoescuela</p>
      </div>
    `,
  };
}

export async function sendLicenseExpirationReminderNotification({ to, instructorName, licenceNumber, expiryDate, daysRemaining }) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'autoescuela@example.com';
  const transporter = createTransporter();

  if (!transporter) {
    console.info(`[email] SMTP no configurado. Se omite el envío de recordatorio para ${to}`);
    return { ok: true, skipped: true };
  }

  const { subject, html } = buildLicenseExpirationReminderEmail({ instructorName, licenceNumber, expiryDate, daysRemaining });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return { ok: true, messageId: info.messageId, skipped: false };
}

export async function sendMaintenanceNotification({ to, instructorName, vehicleMatricula, comment, nivelVencimiento }) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'autoescuela@example.com';
  const transporter = createTransporter();

  if (!transporter) {
    console.info(`[email] SMTP no configurado. Se omite el envío para ${to}`);
    return { ok: true, skipped: true };
  }

  const { subject, html } = buildMaintenanceEmail({ instructorName, vehicleMatricula, comment, nivelVencimiento });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return { ok: true, messageId: info.messageId, skipped: false };
}

export async function sendInstructorPromotionNotification({ to, instructorName, specialization, instructorRut }) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'autoescuela@example.com';
  const transporter = createTransporter();

  if (!transporter) {
    console.info(`[email] SMTP no configurado. Se omite el envío para ${to}`);
    return { ok: true, skipped: true };
  }

  const { subject, html } = buildInstructorPromotionEmail({ instructorName, specialization, instructorRut });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return { ok: true, messageId: info.messageId, skipped: false };
}
