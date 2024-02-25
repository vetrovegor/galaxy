import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDTO } from './dto/create-type.dto';
import { Roles } from '@auth/roles.guard';
import { Role } from '@auth/types';
import { RolesGuard } from '@auth/roles.decorator';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Get()
  async findAll() {
    return await this.typeService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() dto: CreateTypeDTO) {
    return await this.typeService.create(dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':typeId')
  async delete(@Param('typeId') typeId: string) {
    return await this.typeService.delete(typeId);
  }
}
