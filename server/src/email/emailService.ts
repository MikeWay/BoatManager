import * as nodemailer from 'nodemailer';
import { ReportedDefect } from '../model/defect';
import { Config } from '../model/Config';

const FAULT_NOTIFICATION_EMAIL = 'training@exe-sailing-club.org';

/**
 * Sends a fault notification email when a boat is checked in with reported defects.
 *
 * SMTP settings are read from config.json (server/config.json on the server):
 *   smtp_host   - SMTP server hostname
 *   smtp_port   - SMTP server port (default: 587)
 *   smtp_user   - SMTP username
 *   smtp_pass   - SMTP password
 *   smtp_from   - From address (e.g. "Boat Manager <noreply@exe-sailing-club.org>")
 *
 * If smtp_host is not configured the function logs a warning and returns without sending.
 */
export async function sendFaultNotificationEmail(
    boatName: string,
    defects: ReportedDefect[],
    personName: string,
    engineHours: number
): Promise<void> {
    const config = Config.getInstance();

    const smtpHost: string = config.get('smtp_host');
    if (!smtpHost) {
        console.warn('smtp_host not configured in config.json — skipping fault notification email');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(config.get('smtp_port') ?? 587),
        secure: Number(config.get('smtp_port') ?? 587) === 465,
        auth: {
            user: config.get('smtp_user'),
            pass: config.get('smtp_pass'),
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
        from: config.get('smtp_from') ?? `"Boat Manager" <noreply@exe-sailing-club.org>`,
        to: FAULT_NOTIFICATION_EMAIL,
        subject: `Boat fault reported: ${boatName}`,
        text,
        html,
    });

    console.log(`Fault notification email sent to ${FAULT_NOTIFICATION_EMAIL} for boat ${boatName}`);
}
