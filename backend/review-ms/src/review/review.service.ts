import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateReviewDTO } from './dto/create-review.dto';
import { ClientProxy } from '@nestjs/microservices';
import { FileService } from '@file/file.service';
import { ConfigService } from '@nestjs/config';
import { FeedbackService } from '@feedback/feedback.service';
import { CommentService } from '@comment/comment.service';
import { UserService } from '@user/user.service';
import { RabbitMqService } from '@rabbit-mq/rabbit-mq.service';

@Injectable()
export class ReviewService {
    constructor(
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
        private readonly prismaService: PrismaService,
        private readonly fileService: FileService,
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => FeedbackService))
        private readonly feedbackService: FeedbackService,
        @Inject(forwardRef(() => CommentService))
        private readonly commentService: CommentService,
        private readonly userService: UserService,
        private readonly rabbitMqService: RabbitMqService
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
        const existedProduct = await this.rabbitMqService.sendRequest({
            client: this.productClient,
            pattern: 'get_product',
            data: { productId: dto.productId }
        });

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

    async getStats(productId: string) {
        const avgRatingData = await this.prismaService.review.aggregate({
            where: { productId },
            _avg: {
                rate: true
            }
        });

        const reviewsCount = await this.prismaService.review.count({
            where: { productId }
        });

        const avgRating = avgRatingData._avg.rate ? Number(avgRatingData._avg.rate.toFixed(2)) : 0;

        return { avgRating, reviewsCount };
    }

    async getReviews(productId: string, page: number, limit: number) {
        const existedProduct = await this.rabbitMqService.sendRequest({
            client: this.productClient,
            pattern: 'get_product',
            data: { productId }
        });

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
                const { id, productId, userId, ...reviewDTO } = review;

                const user = await this.userService.getById(userId);

                const stats = await this.feedbackService.getReviewStats(id);
                const commentsCount = await this.commentService.getCount(id);

                const images = await this.prismaService.reviewImage.findMany({
                    where: { reviewId: review.id }
                });

                return {
                    id,
                    ...reviewDTO,
                    user,
                    ...stats,
                    commentsCount,
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

    async getImages(productId: string) {
        const reviews = await this.prismaService.review.findMany({
            where: {
                productId
            },
            include: {
                images: true
            },
        });

        const images = reviews.flatMap(review =>
            review.images.map(({ id, url }) => ({
                id,
                url: `${this.configService.get('API_URL')}/${url}`
            }))
        );

        return { images };
    }
}
