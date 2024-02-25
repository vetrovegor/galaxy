import { Public } from '@auth/public.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { ReviewService } from 'src/review/review.service';

@Controller('product')
export class ProductController {
    constructor(
        private readonly reviewService: ReviewService
    ) { }

    @Public()
    @Get(':productId')
    async getProductReviews(@Param('productId') productId: string) {
        return 'public get route';
    }
}
