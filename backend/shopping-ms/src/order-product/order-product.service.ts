import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderProduct } from './order-product.entity';
import { BasketService } from '@basket/basket.service';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderProductService {
    constructor(
        @InjectModel(OrderProduct)
        private readonly orderProductModel: typeof OrderProduct,
        private readonly basketService: BasketService,
        private readonly configService: ConfigService
    ) {}

    async create(orderId: number, userId: string) {
        const { products, totalSum } = await this.basketService.get(userId);

        const staticPath = path.resolve(process.cwd(), 'static');

        if (!fs.existsSync(staticPath)) {
            fs.mkdirSync(staticPath, { recursive: true });
        }

        const pictures = [];

        for (const { _id, model, price, picture, quantity } of products) {
            const response = await axios.get(picture, {
                responseType: 'arraybuffer'
            });

            const pictureName = Date.now() + path.extname(picture);

            fs.writeFileSync(path.join(staticPath, pictureName), response.data);

            pictures.push({
                id: pictures.length + 1,
                picture: `${this.configService.get('API_URL')}/${picture}`
            });

            await this.orderProductModel.create({
                model,
                price,
                picture: pictureName,
                quantity,
                productId: _id,
                orderId
            });
        }

        await this.basketService.delete(userId);

        return {
            totalSum,
            pictures: pictures.slice(0, 5),
            totalPictures: pictures.length
        };
    }

    async getShortInfo(orderId: number) {
        const orderProducts = await this.orderProductModel.findAll({
            where: { orderId }
        });

        let totalSum = 0;
        const pictures = [];

        for (const orderProduct of orderProducts) {
            const { picture, price, quantity } = orderProduct;

            totalSum += price * quantity;

            pictures.push({
                id: pictures.length + 1,
                picture: `${this.configService.get('API_URL')}/${picture}`
            });
        }

        return {
            totalSum,
            pictures: pictures.slice(0, 5),
            totalPictures: pictures.length
        };
    }

    async getFullInfo(orderId: number) {
        const orderProducts = await this.orderProductModel.findAll({
            where: { orderId }
        });

        const products = [];
        let totalSum = 0;
        let productsQuantity = 0;

        for (const orderProduct of orderProducts) {
            const { productId, model, picture, price, quantity } = orderProduct;

            products.push({
                id: productId,
                model,
                picture: `${this.configService.get('API_URL')}/${picture}`,
                price,
                quantity
            });

            totalSum += price * quantity;
            productsQuantity += quantity;
        }

        return {
            products,
            totalSum,
            productsQuantity
        };
    }
}
