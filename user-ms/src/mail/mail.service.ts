import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

    async sendVerificationMail(to: string, code: string) {
        await this.mailerService.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Активация аккаунта на ${this.configService.get('CLIENT_URL')}`,
            html: `
                    <div>
                        <h1>Для активации перейдите по ссылке:</h1>
                        <a href="${this.configService.get('API_URL')}/auth/verify/${code}">Ссылка</a>
                    </div>
                `
        });
    }
}
