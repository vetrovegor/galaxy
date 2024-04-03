import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { Basket } from './basket.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModule } from '@product/product.module';

@Module({
    imports: [SequelizeModule.forFeature([Basket]), ProductModule],
    controllers: [BasketController],
    providers: [BasketService],
    exports: [BasketService]
})
export class BasketModule {}
