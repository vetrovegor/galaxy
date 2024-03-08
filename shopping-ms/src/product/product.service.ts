import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy
    ) { }

    async findById(productId: string) {
        const product: ProductDto = await firstValueFrom(
            this.productClient.send('get_product', { productId })
        );

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        return product;
    }
}
