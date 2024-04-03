import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { TypeModule } from 'src/type/type.module';
import { FileModule } from '@file/file.module';
import { AuthModule } from '@auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'REVIEW_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`${configService.get('RNQ_URL')}`],
                        queue: 'review-queue',
                        queueOptions: { durable: false }
                    }
                }),
                inject: [ConfigService]
            }
        ]),
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema }
        ]),
        forwardRef(() => TypeModule),
        FileModule,
        AuthModule
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule {}
