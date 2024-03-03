import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { FavoriteModule } from '@favorite/favorite.module';
import { AuthModule } from '@auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { ProductModule } from './product/product.module';
import { BasketModule } from '@basket/basket.module';

@Module({
  imports:
    [
      ConfigModule.forRoot({ isGlobal: true }),
      DatabaseModule,
      AuthModule,
      FavoriteModule,
      ProductModule,
      BasketModule
    ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule { }
