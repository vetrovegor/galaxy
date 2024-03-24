import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CurrentUser } from '@auth/current-user.decorator';
import { JwtPayload } from '@auth/types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateReviewDTO } from './dto/create-review.dto';
import { CommentService } from '@comment/comment.service';
import { Public } from '@auth/public.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly commentService: CommentService
  ) { }

  // сделать валидацию что images могут быть только картинками, размер файла
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  async create(
    @Body() dto: CreateReviewDTO,
    @UploadedFiles() images: Express.Multer.File[],
    @CurrentUser() user: JwtPayload
  ) {
    return this.reviewService.create(dto, images, user.id);
  }

  @Public()
  @Get(':reviewId/comment')
  async getComments(
    @Param('reviewId') reviewId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.commentService.getComments(reviewId, page, limit);
  }

  @MessagePattern('get_stats')
  async getStats(data: { productId: string }) {
    return await this.reviewService.getStats(data.productId);
  }
}
