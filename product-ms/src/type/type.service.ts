import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Type } from './type.schema';
import { Model } from 'mongoose';
import { CreateTypeDTO } from './dto/create-type.dto';
import { ProductService } from '@product/product.service';

@Injectable()
export class TypeService {
    constructor(
        @InjectModel(Type.name) private typeModel: Model<Type>
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

    async delete(brandId: string) {
        const existedType = await this.typeModel.findById(brandId).exec();

        if (!existedType) {
            throw new NotFoundException('Тип не найден');
        }

        await this.typeModel.deleteOne({ _id: brandId });

        return existedType;
    }

    async findById(id: string) {
        return await this.typeModel.findById(id).exec();
    }

    async getCharacteristicsByTypeId(id: string) {
        const type = await this.typeModel.findById(id).exec();
        return type.characteristics;
    }
}
