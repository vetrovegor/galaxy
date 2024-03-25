import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductDto } from './dto/product.dto';
import { RabbitMqService } from '@rabbit-mq/rabbit-mq.service';

@Injectable()
export class ProductService {
    constructor(
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
        private readonly rabbitMqService: RabbitMqService
    ) { }

    async findById(productId: string) {
        const product: ProductDto = await this.rabbitMqService.sendRequest({
            client: this.productClient,
            pattern: 'get_product',
            data: {productId},
            timeoutDuration: 1250
        });

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        return product;
    }
}
