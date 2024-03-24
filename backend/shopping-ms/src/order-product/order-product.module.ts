import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderProduct } from './order-product.entity';
import { BasketModule } from '@basket/basket.module';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderProduct]),
    BasketModule
  ],
  providers: [OrderProductService],
  exports: [OrderProductService],
})
export class OrderProductModule { }
