import nodemailer from "nodemailer";

import { appConfig } from "../../config/app.config";

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

class NotificationService {
    private readonly transporter = nodemailer.createTransport({
        host: appConfig.mail.host,
        port: appConfig.mail.port,
        auth: {
            user: appConfig.mail.user,
            pass: appConfig.mail.pass,
        },
    });

    public async send(options: MailOptions): Promise<void> {
        await this.transporter.sendMail({
            from: appConfig.mail.from,
            ...options,
        });
    }
}

export const notificationService = new NotificationService();
