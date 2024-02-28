import { Public } from '@auth/public.decorator';
import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReviewService } from 'src/review/review.service';

@Controller('product')
export class ProductController {
    constructor(
        private readonly reviewService: ReviewService
    ) { }

    @Public()
    @Get(':productId/image')
    async getProductReviewImages(@Param('productId') productId: number) {
        return await this.reviewService.getImages(productId);
    }

    @Public()
    @Get(':productId/review')
    async getProductReviews(
        @Param('productId') productId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        return await this.reviewService.getReviews(productId, page, limit);
    }
}
