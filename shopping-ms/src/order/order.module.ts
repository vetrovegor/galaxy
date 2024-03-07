import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.entity';
import { OrderProductModule } from '@order-product/order-product.module';
import { BasketModule } from '@basket/basket.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RNQ_URL')}`],
            queue: 'user-queue',
            queueOptions: { durable: false }
          }
        }),
        inject: [ConfigService]
      }
    ]),
    SequelizeModule.forFeature([Order]),
    BasketModule,
    OrderProductModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
