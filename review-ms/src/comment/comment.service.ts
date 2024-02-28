import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { ReviewService } from '@review/review.service';
import { PrismaService } from '@prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommentService {
    constructor(
        @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
        private readonly prismaService: PrismaService,
        private readonly reviewService: ReviewService
    ) { }

    async create(dto: CreateCommentDTO, userId: string) {
        dto.reviewId = Number(dto.reviewId);

        await this.reviewService.getById(dto.reviewId);

        return await this.prismaService.reviewComment.create({
            data: { ...dto, userId }
        });
    }

    async getComments(reviewId: number, page: number, limit: number) {
        reviewId = Number(reviewId);

        await this.reviewService.getById(reviewId);

        const offset = (page - 1) * limit;

        const totalCount = await this.prismaService.reviewComment.count({
            where: { reviewId },
        });

        const commentsData = await this.prismaService.reviewComment.findMany({
            take: limit,
            skip: offset,
            where: { reviewId },
            orderBy: { date: 'desc' },
        });

        const comments = await Promise.all(
            commentsData.map(async review => {
                const { userId, ...reviewDTO } = review;

                // подумать как предусмотреть ситуацию если долго не возвращается пользователь то устанавливать его в null
                const user = await firstValueFrom(
                    this.userClient.send('get_user', { userId: review.userId })
                );

                return {
                    ...reviewDTO,
                    user
                }
            })
        );

        return {
            elementsCount: commentsData.length,
            totalCount,
            isLastPage: page * limit >= totalCount,
            comments
        };
    }
}
