import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { Roles } from '@auth/roles.guard';
import { RolesGuard } from '@auth/roles.decorator';
import { Role } from '@auth/types';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Get()
  async findAll() {
    return await this.brandService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() dto: CreateBrandDTO) {
    return await this.brandService.create(dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':brandId')
  async delete(@Param('brandId') brandId: string) {
    return await this.brandService.delete(brandId);
  }
}
