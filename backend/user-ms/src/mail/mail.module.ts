import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CodeModule } from '@code/code.module';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('SMTP_HOST'),
                    secure: true,
                    auth: {
                        user: configService.get('SMTP_USER'),
                        pass: configService.get('SMTP_PASSWORD')
                    }
                }
            }),
            inject: [ConfigService]
        }),
        CodeModule
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
