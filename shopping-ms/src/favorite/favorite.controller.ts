import { Body, Controller, Get, Post } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { CurrentUser } from '@auth/current-user.decorator';
import { JwtPayload } from '@auth/types';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @Post()
  async toggle(@Body() dto: ToggleFavoriteDto, @CurrentUser() user: JwtPayload) {
    return await this.favoriteService.toggle(dto, user.id);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    return await this.favoriteService.findAll(user.id);
  }
}
