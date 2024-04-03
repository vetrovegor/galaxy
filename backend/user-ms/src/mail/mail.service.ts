import { CodeService } from '@code/code.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/user.emtity';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly codeService: CodeService,
        private readonly configService: ConfigService
    ) {}

    async sendVerificationMail(user: User) {
        try {
            const code = await this.codeService.saveVerificationCode(user);

            await this.mailerService.sendMail({
                from: process.env.SMTP_USER,
                to: user.email,
                subject: `Активация аккаунта на Galaxy`,
                html: `
                        <div>
                            <h1>Для активации перейдите по ссылке:</h1>
                            <a href="${this.configService.get('API_URL')}/auth/verify/${code}">Ссылка</a>
                        </div>
                    `
            });
        } catch (error) {
            console.log(error);
        }
    }
}
