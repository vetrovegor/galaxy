import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import 'dotenv/config';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                dialect: 'mariadb',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                database: configService.get('DB_NAME'),
                username: configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                synchronize: configService.get('DB_SYNC'),
                models: [__dirname + '/**/*.entity.{js,ts}'],
                autoLoadModels: true
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}
