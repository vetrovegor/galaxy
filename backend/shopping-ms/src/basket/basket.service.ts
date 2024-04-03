import { Injectable, NotFoundException } from '@nestjs/common';
import { BasketProductDto } from './dto/basket-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Basket } from './basket.entity';
import { ProductService } from '@product/product.service';

@Injectable()
export class BasketService {
    constructor(
        @InjectModel(Basket) private readonly basketModel: typeof Basket,
        private readonly productService: ProductService
    ) {}

    async addProduct(
        { productId, quantity }: BasketProductDto,
        userId: string
    ) {
        await this.productService.findById(productId);

        const existedBasketItem = await this.basketModel.findOne({
            where: { productId, userId }
        });

        if (!existedBasketItem) {
            return await this.basketModel.create({
                productId,
                userId,
                quantity
            });
        }

        existedBasketItem.quantity += quantity;

        return await existedBasketItem.save();
    }

    async removeProduct(productId: string, userId: string) {
        const existedBasketItem = await this.basketModel.findOne({
            where: { productId, userId }
        });

        if (!existedBasketItem) {
            throw new NotFoundException('Продукт не найден');
        }

        if (existedBasketItem.quantity == 1) {
            return await existedBasketItem.destroy();
        }

        existedBasketItem.quantity--;

        return await existedBasketItem.save();
    }

    async get(userId: string) {
        const basketItems = await this.basketModel.findAll({
            where: { userId }
        });

        let productsQuantity = 0;
        let totalSum = 0;

        const products = await Promise.all(
            basketItems.map(async ({ quantity, productId }) => {
                const product = await this.productService.findById(productId);

                productsQuantity += quantity;
                totalSum += product.price * quantity;

                return {
                    ...product,
                    quantity
                };
            })
        );

        return { products, productsQuantity, totalSum };
    }

    async clear(userId: string) {
        return await this.basketModel.destroy({
            where: { userId }
        });
    }

    async getCount(userId: string) {
        return await this.basketModel.count({
            where: { userId }
        });
    }

    async delete(userId: string) {
        return await this.basketModel.destroy({
            where: { userId }
        });
    }
}
