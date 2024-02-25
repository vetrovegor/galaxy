import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import { Model } from 'mongoose';
import { CreateBrandDTO } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
    constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) { }

    async findAll() {
        return await this.brandModel.find().exec();
    }

    async create(dto: CreateBrandDTO) {
        const existedBrand = await this.brandModel.findOne({ name: dto.name }).exec();

        if (existedBrand) {
            throw new BadRequestException('Бренд с таким названием уже существует');
        }

        const createdBrand = new this.brandModel(dto);

        return await createdBrand.save();
    }

    async delete(brandId: string) {
        const existedBrand = await this.brandModel.findById(brandId).exec();

        if (!existedBrand) {
            throw new NotFoundException('Бренд не найден');
        }

        await this.brandModel.deleteOne({ _id: brandId });

        return existedBrand;
    }

    async findById(id: string) {
        return await this.brandModel.findById(id).exec();
    }
}
