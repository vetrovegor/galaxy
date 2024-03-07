import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentUser } from '@auth/current-user.decorator';
import { JwtPayload } from '@auth/types';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async get(@CurrentUser() user: JwtPayload) {
    return await this.orderService.get(user.id);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    return await this.orderService.create(dto, user.id);
  }
}
