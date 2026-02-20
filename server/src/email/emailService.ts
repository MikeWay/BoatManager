import * as nodemailer from 'nodemailer';
import { ReportedDefect } from '../model/defect';

const FAULT_NOTIFICATION_EMAIL = 'training@exe-sailing-club.org';

/**
 * Sends a fault notification email when a boat is checked in with reported defects.
 *
 * Requires the following environment variables to be set on the server:
 *   SMTP_HOST   - SMTP server hostname
 *   SMTP_PORT   - SMTP server port (default: 587)
 *   SMTP_USER   - SMTP username
 *   SMTP_PASS   - SMTP password
 *   SMTP_FROM   - From address (e.g. "Boat Manager <noreply@exe-sailing-club.org>")
 *
 * If SMTP_HOST is not set the function logs a warning and returns without sending.
 */
export async function sendFaultNotificationEmail(
    boatName: string,
    defects: ReportedDefect[],
    personName: string,
    engineHours: number
): Promise<void> {
    const smtpHost = process.env['SMTP_HOST'];
    if (!smtpHost) {
        console.warn('SMTP_HOST not set — skipping fault notification email');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env['SMTP_PORT'] ?? 587),
        secure: Number(process.env['SMTP_PORT'] ?? 587) === 465,
        auth: {
            user: process.env['SMTP_USER'],
            pass: process.env['SMTP_PASS'],
        },
    });

    const defectLines = defects.map(d => {
        const detail = d.additionalInfo ? ` — ${d.additionalInfo}` : '';
        return `  • ${d.defectType.name}${detail}`;
    }).join('\n');

    const checkedInAt = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

    const text = `
A boat has been checked in with reported faults.

Boat:          ${boatName}
Checked in by: ${personName}
Engine hours:  ${engineHours}
Time:          ${checkedInAt}

Reported faults:
${defectLines}

Please review and arrange for maintenance as required.

-- Boat Manager
`.trim();

    const html = `
<p>A boat has been checked in with reported faults.</p>
<table>
  <tr><td><strong>Boat:</strong></td><td>${boatName}</td></tr>
  <tr><td><strong>Checked in by:</strong></td><td>${personName}</td></tr>
  <tr><td><strong>Engine hours:</strong></td><td>${engineHours}</td></tr>
  <tr><td><strong>Time:</strong></td><td>${checkedInAt}</td></tr>
</table>
<p><strong>Reported faults:</strong></p>
<ul>
${defects.map(d => {
    const detail = d.additionalInfo ? ` &mdash; ${d.additionalInfo}` : '';
    return `  <li>${d.defectType.name}${detail}</li>`;
}).join('\n')}
</ul>
<p>Please review and arrange for maintenance as required.</p>
<hr>
<small>Boat Manager</small>
`.trim();

    await transporter.sendMail({
        from: process.env['SMTP_FROM'] ?? `"Boat Manager" <noreply@exe-sailing-club.org>`,
        to: FAULT_NOTIFICATION_EMAIL,
        subject: `Boat fault reported: ${boatName}`,
        text,
        html,
    });

    console.log(`Fault notification email sent to ${FAULT_NOTIFICATION_EMAIL} for boat ${boatName}`);
}
