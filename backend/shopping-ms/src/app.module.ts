import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { FavoriteModule } from '@favorite/favorite.module';
import { AuthModule } from '@auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { ProductModule } from './product/product.module';
import { BasketModule } from '@basket/basket.module';
import { OrderModule } from './order/order.module';
import { OrderProductModule } from './order-product/order-product.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RabbitMqModule } from '@rabbit-mq/rabbit-mq.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ServeStaticModule.forRoot({
            rootPath: path.join(process.cwd(), 'static')
        }),
        DatabaseModule,
        AuthModule,
        FavoriteModule,
        ProductModule,
        BasketModule,
        OrderModule,
        OrderProductModule,
        RabbitMqModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ]
})
export class AppModule {}
