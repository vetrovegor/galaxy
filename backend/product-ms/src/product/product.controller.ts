import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '@auth/roles.guard';
import { Role } from '@auth/types';
import { RolesGuard } from '@auth/roles.decorator';
import { MessagePattern } from '@nestjs/microservices';
import { GetProductRequest } from './dto/get-product-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Product } from './product.schema';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async findAll(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('type') type?: string,
        @Query('brand') brand?: string
    ) {
        return await this.productService.findAll(page, limit, type, brand);
    }

    @UseInterceptors(CacheInterceptor)
    @Get(':id')
    async getFullInfo(@Param('id') id: string) {
        return await this.productService.getFullInfo(id);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('picture'))
    async create(
        @Body() dto: CreateProductDTO,
        @UploadedFile() picture: Express.Multer.File
    ): Promise<Product> {
        return await this.productService.create(dto, picture);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Product> {
        return await this.productService.delete(id);
    }

    @MessagePattern('get_product')
    async getById(data: GetProductRequest) {
        return await this.productService.getById(data.productId);
    }
}
