import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { reaction } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { ReviewService } from '@review/review.service';

@Injectable()
export class FeedbackService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => ReviewService))
        private readonly reviewService: ReviewService
    ) { }

    async toggleReaction(reviewId: number, userId: string, isLike: boolean) {
        await this.reviewService.getById(reviewId);

        const feedback = await this.prismaService.reviewFeedBack.findFirst({
            where: { reviewId, userId }
        });

        const reactionType = isLike ? reaction.LIKE : reaction.DISLIKE;

        if (!feedback || feedback.reaction !== reactionType) {
            if (feedback) {
                await this.prismaService.reviewFeedBack.delete({
                    where: { id: feedback.id }
                });
            }

            return await this.prismaService.reviewFeedBack.create({
                data: {
                    reviewId,
                    userId,
                    reaction: reactionType
                }
            });
        } else {
            return await this.prismaService.reviewFeedBack.delete({
                where: { id: feedback.id }
            });
        }
    }

    async getReviewStats(reviewId: number) {
        const likesCount = await this.prismaService.reviewFeedBack.count({
            where: { reviewId, reaction: reaction.LIKE }
        });

        const dislikesCount = await this.prismaService.reviewFeedBack.count({
            where: { reviewId, reaction: reaction.DISLIKE }
        });

        return { likesCount, dislikesCount };
    }
}
