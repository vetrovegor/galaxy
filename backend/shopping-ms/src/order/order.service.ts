import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.entity';
import { OrderProductService } from '@order-product/order-product.service';
import { BasketService } from '@basket/basket.service';
import { AddressDto } from './dto/address.dto';
import { RabbitMqService } from '@rabbit-mq/rabbit-mq.service';

@Injectable()
export class OrderService {
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        @InjectModel(Order) private readonly orderModel: typeof Order,
        private readonly basketService: BasketService,
        private readonly orderProductService: OrderProductService,
        private readonly rabbitMqService: RabbitMqService
    ) {}

    async getAll(userId: string) {
        const ordersData = await this.orderModel.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        });

        const orders = await Promise.all(
            ordersData.map(async ({ id, tracking, date }) => {
                const data = await this.orderProductService.getShortInfo(id);

                return {
                    id,
                    tracking,
                    date,
                    ...data
                };
            })
        );

        return { orders };
    }

    async getById(orderId: number, userId: string) {
        const order = await this.orderModel.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        const { id, tracking, date, street, floor, flat } = order;

        const data = await this.orderProductService.getFullInfo(orderId);

        return {
            order: {
                id,
                tracking,
                date,
                ...data,
                address: {
                    street,
                    floor,
                    flat
                }
            }
        };
    }

    async create({ addressId }: CreateOrderDto, userId: string) {
        const productsCount = await this.basketService.getCount(userId);

        if (productsCount == 0) {
            throw new BadRequestException('Корзина пуста');
        }

        const address: AddressDto = await this.rabbitMqService.sendRequest({
            client: this.userClient,
            pattern: 'get_user_address',
            data: { userId, addressId }
        });

        if (!address) {
            throw new NotFoundException('Адрес не найден');
        }

        const { street, floor, flat } = address;

        const currentDate = new Date();
        const randomNumber =
            Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
        const tracking = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}-${randomNumber}`;

        const order = await this.orderModel.create({
            tracking,
            date: currentDate,
            userId,
            street,
            floor,
            flat
        });

        const { totalSum, pictures, totalPictures } =
            await this.orderProductService.create(order.id, userId);

        return {
            id: order.id,
            tracking,
            date: currentDate,
            totalSum,
            pictures,
            totalPictures
        };
    }
}
