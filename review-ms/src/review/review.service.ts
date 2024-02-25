import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateReviewDTO } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(
        dto: CreateReviewDTO,
        images: Express.Multer.File[],
        userId: string
    ) {
        return dto;
    }
}
