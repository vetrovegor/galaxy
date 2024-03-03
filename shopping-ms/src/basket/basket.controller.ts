import { Body, Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketProductDto } from './dto/basket-product.dto';
import { CurrentUser } from '@auth/current-user.decorator';
import { JwtPayload } from '@auth/types';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) { }

  @Post()
  async addProduct(@Body() dto: BasketProductDto, @CurrentUser() user: JwtPayload) {
    return await this.basketService.addProduct(dto, user.id);
  }

  @Delete(':productId')
  async removeProduct(@Param('productId') productId: string, @CurrentUser() user: JwtPayload) {
    await this.basketService.removeProduct(productId, user.id);

    return HttpStatus.OK;
  }

  @Get()
  async get(@CurrentUser() user: JwtPayload) {
    return await this.basketService.get(user.id);
  }
}
