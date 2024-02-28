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
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        private readonly prismaService: PrismaService,
        private readonly fileService: FileService,
        private readonly configService: ConfigService
    ) { }

    async getById(id: number) {
        const review = await this.prismaService.review.findFirst({
            where: { id }
        });

        if (!review) {
            throw new NotFoundException('Отзыв не найден');
        }

        return review;
    }

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

    async getReviews(productId: string, page: number, limit: number) {
        const existedProduct = await firstValueFrom(
            this.productClient.send('get_product', { productId })
        );

        if (!existedProduct) {
            throw new NotFoundException('Продукт не найден');
        }

        const offset = (page - 1) * limit;

        const totalCount = await this.prismaService.review.count({
            where: { productId }
        });

        const reviewsData = await this.prismaService.review.findMany({
            take: limit,
            skip: offset,
            where: { productId },
            orderBy: { date: 'desc' },
        });

        const reviews = await Promise.all(
            reviewsData.map(async review => {
                const { productId, userId, ...reviewDTO } = review;

                // подумать как предусмотреть ситуацию если долго не возвращается пользователь то устанавливать его в null
                const user = await firstValueFrom(
                    this.userClient.send('get_user', { userId: review.userId })
                );

                const images = await this.prismaService.reviewImage.findMany({
                    where: { reviewId: review.id }
                });

                return {
                    ...reviewDTO,
                    user,
                    images: images.map(image => ({
                        id: image.id,
                        url: `${this.configService.get('API_URL')}/${image.url}`
                    }))
                };
            })
        );

        return {
            elementsCount: reviewsData.length,
            totalCount,
            isLastPage: page * limit >= totalCount,
            reviews
        };
    }

    async getImages(reviewId: number) {
        const images = await this.prismaService.reviewImage.findMany();

        return {
            images: images.map(image => ({
                id: image.id,
                url: `${this.configService.get('API_URL')}/${image.url}`
            }))
        };
    }
}
