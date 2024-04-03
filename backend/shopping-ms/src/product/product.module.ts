import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'PRODUCT_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`${configService.get('RNQ_URL')}`],
                        queue: 'product-queue',
                        queueOptions: { durable: false }
                    }
                }),
                inject: [ConfigService]
            }
        ])
    ],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule {}
