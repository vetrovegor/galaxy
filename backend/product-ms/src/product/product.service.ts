import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { TypeService } from 'src/type/type.service';
import { FileService } from '@file/file.service';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMqService } from '@rabbit-mq/rabbit-mq.service';

@Injectable()
export class ProductService {
    constructor(
        @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
        @Inject(forwardRef(() => TypeService))
        private readonly typeService: TypeService,
        private readonly fileService: FileService,
        private readonly configService: ConfigService,
        private readonly rabbitMqService: RabbitMqService
    ) { }

    private async getStats(productId) {
        return await this.rabbitMqService.sendRequest({
            client: this.reviewClient,
            pattern: 'get_stats',
            data: { productId }
        });
    }

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
            .select('-brand')
            .exec();

        const data = await Promise.all(
            productsData.map(async product => {
                const stats = await this.getStats(product._id);

                return {
                    _id: product._id,
                    model: product.model,
                    price: product.price,
                    picture: `${this.configService.get('API_URL')}/${product.picture}`,
                    stats
                }
            })
        );

        return {
            data,
            totalCount
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

        const stats = await this.getStats(id);

        const { _id, model, desc, price, picture, type, brand, characteristics } = product;

        return {
            product: {
                _id: _id,
                model: model,
                desc,
                price: price,
                picture: `${this.configService.get('API_URL')}/${picture}`,
                stats,
                type: type,
                brand: brand,
                characteristics: characteristics
            }
        };
    }

    async create(dto: CreateProductDTO, picture: Express.Multer.File) {
        const { characteristics: typeCharacteristics } = await this.typeService.getCharacteristicsByTypeId(dto.type);

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
            const { _id, model, price, picture, brand } = await this.productModel
                .findById(id)
                .select('-characteristics')
                .select('-type')
                .select('-brand')
                .exec();

            const stats = await this.getStats(id);

            return {
                _id,
                model,
                stats,
                price,
                picture: `${this.configService.get('API_URL')}/${picture}`
            };
        } catch (error) {
            return null;
        }
    }

    async getProductsCountByType(typeId: string) {
        return await this.productModel.countDocuments({ type: typeId }).exec();
    }

    async getProductsCountByBrand(brandId: string) {
        return await this.productModel.countDocuments({ brand: brandId }).exec();
    }
}
