import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CurrentUser } from '@auth/current-user.decorator';
import { JwtPayload } from '@auth/types';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Get('product/:reviewId/like')
    async toggleLike(
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @CurrentUser() user: JwtPayload
    ) {
        return await this.feedbackService.toggleReaction(
            reviewId,
            user.id,
            true
        );
    }

    @Get('product/:reviewId/dislike')
    async toggleDislike(
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @CurrentUser() user: JwtPayload
    ) {
        return await this.feedbackService.toggleReaction(
            reviewId,
            user.id,
            false
        );
    }
}
