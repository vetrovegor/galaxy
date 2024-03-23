import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { ReviewService } from '@review/review.service';
import { PrismaService } from '@prisma/prisma.service';
import { UserService } from '@user/user.service';

@Injectable()
export class CommentService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => ReviewService))
        private readonly reviewService: ReviewService,
        private readonly userService: UserService
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

                const user = await this.userService.getById(userId);

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

    async getCount(reviewId: number) {
        return await this.prismaService.reviewComment.count({
            where: { reviewId }
        });
    }
}
