import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CurrentUser } from '@auth/current-user.decorator';
import { JwtPayload } from '@auth/types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateReviewDTO } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
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
}
