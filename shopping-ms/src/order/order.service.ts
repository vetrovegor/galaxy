import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.entity';
import { OrderProductService } from '@order-product/order-product.service';
import { BasketService } from '@basket/basket.service';

@Injectable()
export class OrderService {
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @InjectModel(Order) private readonly orderModel: typeof Order,
        private readonly basketService: BasketService,
        private readonly orderProductService: OrderProductService
    ) { }

    // доработать
    async get(userId: string) {
        const orders = await this.orderModel.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });

        return await Promise.all(
            orders.map(({ id, tracking, date }) => {
                return {
                    id,
                    tracking,
                    date: this.formatDate(date)
                };
            })
        );
    }

    async create({ addressId }: CreateOrderDto, userId: string) {
        const productsCount = await this.basketService.getCount(userId);

        if (productsCount == 0) {
            throw new BadRequestException('Корзина пуста');
        }

        const address = await firstValueFrom(
            this.userClient.send('get_user_address', { userId, addressId })
        );

        if (!address) {
            throw new NotFoundException('Адрес не найден');
        }

        const currentDate = new Date();
        const randomNumber = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;;
        const tracking = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}-${randomNumber}`;

        const order = await this.orderModel.create({
            tracking,
            date: currentDate,
            userId,
            addressId
        });

        const { totalSum, pictures, totalPictures } = await this.orderProductService.create(order.id, userId);

        return {
            id: order.id,
            tracking,
            date: this.formatDate(currentDate),
            totalSum,
            pictures,
            totalPictures
        };
    }

    // вынести в shared
    private formatDate(date: Date) {
        const months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];

        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }
}
