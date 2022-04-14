import { transporter } from 'configuration/nodemailer';
import Mail from 'nodemailer/lib/mailer';

export const compose = (from: string, to: string, subject: string, body: string): Mail.Options =>
  ({
    from,
    to,
    subject,
    html: body,
  });

export const send = (email: Mail.Options) => transporter.sendMail(email);
