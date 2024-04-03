import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards
} from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDTO } from './dto/create-type.dto';
import { Roles } from '@auth/roles.guard';
import { Role } from '@auth/types';
import { RolesGuard } from '@auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Type } from './type.schema';

@ApiTags('Types')
@ApiBearerAuth()
@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

    @Get()
    async findAll(): Promise<Type[]> {
        return await this.typeService.findAll();
    }

    @Get(':typeId/characteristic')
    async getType(@Param('typeId') typeId: string) {
        return await this.typeService.getCharacteristicsByTypeId(typeId);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    async create(@Body() dto: CreateTypeDTO): Promise<Type> {
        return await this.typeService.create(dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':typeId')
    async delete(@Param('typeId') typeId: string): Promise<Type> {
        return await this.typeService.delete(typeId);
    }
}
