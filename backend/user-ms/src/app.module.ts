import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CodeModule } from './code/code.module';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guards';
import { AddressModule } from './address/address.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        CodeModule,
        MailModule,
        AddressModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ]
})
export class AppModule {}
