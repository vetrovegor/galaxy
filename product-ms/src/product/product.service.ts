import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { TypeService } from 'src/type/type.service';
import { FileService } from '@file/file.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @Inject(forwardRef(() => TypeService))
        private typeService: TypeService,
        private fileService: FileService,
        private configService: ConfigService
    ) { }

    async findAll(page: number, limit: number, type?: string, brand?: string) {
        let productQuery = this.productModel.find();

        if (type) {
            productQuery = productQuery.where('type').equals(type);
        }
        if (brand) {
            productQuery = productQuery.where('brand').equals(brand);
        }

        const totalCount = await this.productModel.countDocuments(productQuery.getQuery());

        const productsData = await productQuery
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-characteristics')
            .select('-type')
            .populate('brand', 'name')
            .exec();

        return {
            elementsCount: productsData.length,
            totalCount,
            isLastPage: page * limit >= totalCount,
            data: productsData.map(product => ({
                _id: product._id,
                model: product.model,
                price: product.price,
                picture: `${this.configService.get('API_URL')}/${product.picture}`,
                brand: product.brand
            }))
        };
    }

    async getFullInfo(id: string) {
        const product = await this.productModel
            .findById(id)
            .populate('type', 'name')
            .populate('brand', 'name');

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        return {
            _id: product._id,
            model: product.model,
            price: product.price,
            picture: `${this.configService.get('API_URL')}/${product.picture}`,
            type: product.type,
            brand: product.brand,
            characteristics: product.characteristics
        };
    }

    async create(dto: CreateProductDTO, picture: Express.Multer.File) {
        const typeCharacteristics = await this.typeService.getCharacteristicsByTypeId(dto.type);

        if (typeCharacteristics.length !== dto.characteristics.length
            || !dto.characteristics.every(item => typeCharacteristics.includes(item.characteristic))) {
            throw new BadRequestException('Некорректные характеристики');
        }

        const fileName = await this.fileService.saveFile(picture);

        const createdProduct = new this.productModel({
            ...dto,
            picture: fileName
        });

        return await createdProduct.save();
    }

    async delete(id: string) {
        const product = await this.productModel.findById(id).exec();

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        await this.productModel.deleteOne({ _id: id });

        return product;
    }

    async getById(id: string) {
        try {
            return await this.productModel.findById(id);
        } catch (error) {
            return null;
        }
    }

    async getProductsCountByType(typeId: string) {
        return await this.productModel.countDocuments({type: typeId}).exec();
    }

    async getProductsCountByBrand(brandId: string) {
        return await this.productModel.countDocuments({brand: brandId}).exec();
    }
}
