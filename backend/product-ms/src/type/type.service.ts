import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Type } from './type.schema';
import { Model } from 'mongoose';
import { CreateTypeDTO } from './dto/create-type.dto';
import { ProductService } from '@product/product.service';
import { CharacteristicDto } from '@product/dto/create-product.dto';

@Injectable()
export class TypeService {
    constructor(
        @InjectModel(Type.name) private typeModel: Model<Type>,
        @Inject(forwardRef(() => ProductService))
        private productService: ProductService
    ) { }

    async findAll() {
        return await this.typeModel.find().select('-characteristics').exec();
    }

    async create(dto: CreateTypeDTO) {
        const existedType = await this.typeModel.findOne({ name: dto.name }).exec();

        if (existedType) {
            throw new BadRequestException('Тип с таким названием уже существует');
        }

        const createdBrand = new this.typeModel(dto);

        return await createdBrand.save();
    }

    async delete(typeId: string) {
        const existedType = await this.typeModel.findById(typeId).exec();

        if (!existedType) {
            throw new NotFoundException('Тип не найден');
        }

        const productsCount = await this.productService.getProductsCountByType(typeId);

        if (productsCount > 0) {
            throw new ConflictException('Невозможно удалить тип, так как существуют продукты с этим типом');
        }

        await this.typeModel.deleteOne({ _id: typeId });

        return existedType;
    }

    async findById(id: string) {
        return await this.typeModel.findById(id).exec();
    }

    async getCharacteristicsByTypeId(id: string) {
        const type = await this.typeModel.findById(id).exec();
        return {characteristics: type.characteristics};
    }
}
