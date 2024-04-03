import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { Roles } from '@auth/roles.guard';
import { RolesGuard } from '@auth/roles.decorator';
import { Role } from '@auth/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Brand } from './brand.schema';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Brands')
@ApiBearerAuth()
@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @UseInterceptors(CacheInterceptor)
    @Get()
    async findAll(): Promise<Brand[]> {
        return await this.brandService.findAll();
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    async create(@Body() dto: CreateBrandDTO): Promise<Brand> {
        return await this.brandService.create(dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':brandId')
    async delete(@Param('brandId') brandId: string): Promise<Brand> {
        return await this.brandService.delete(brandId);
    }
}
