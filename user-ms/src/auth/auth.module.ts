import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { CodeModule } from '@code/code.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UserModule,
        CodeModule,
        MailModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXP')
                }
            }),
            inject: [ConfigService]
        }),
        TypeOrmModule.forFeature([Token])
    ]
})
export class AuthModule { }
