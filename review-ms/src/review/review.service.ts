import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { FileService } from '@file/file.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewService {
    constructor(
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
        private readonly prismaService: PrismaService,
        private readonly fileService: FileService,
        private readonly configService: ConfigService
    ) { }

    async create(
        dto: CreateReviewDTO,
        images: Express.Multer.File[],
        userId: string
    ) {
        const existedProduct = await firstValueFrom(
            this.productClient.send('get_product', { productId: dto.productId })
        );

        if (!existedProduct) {
            throw new NotFoundException('Продукт не найден');
        }

        const createdReview = await this.prismaService.review.create({
            data: {
                ...dto,
                rate: Number(dto.rate),
                userId
            }
        });

        const createdImages = await Promise.all(
            images.map(async image => {
                const fileName = await this.fileService.saveFile(image);

                const createdImage = await this.prismaService.reviewImage.create({
                    data: { url: fileName, reviewId: createdReview.id }
                });

                return {
                    id: createdImage.id,
                    url: `${this.configService.get('API_URL')}/${createdImage.url}`
                };
            })
        );

        return {
            review: {
                ...createdReview,
                images: createdImages
            }
        };
    }
}
