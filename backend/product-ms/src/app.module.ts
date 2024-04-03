import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BrandModule } from './brand/brand.module';
import { TypeModule } from './type/type.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { IsExistsConstraint } from '@shared/validation/is-exists.constraint';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { RabbitMqModule } from '@rabbit-mq/rabbit-mq.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static')
        }),
        CacheModule.register({ isGlobal: true }),
        DatabaseModule,
        BrandModule,
        TypeModule,
        ProductModule,
        FileModule,
        AuthModule,
        RabbitMqModule
    ],
    providers: [IsExistsConstraint]
})
export class AppModule {}
