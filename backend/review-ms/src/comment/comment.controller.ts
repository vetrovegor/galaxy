import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { CurrentUser } from '@auth/current-user.decorator';
import { JwtPayload } from '@auth/types';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async create(
        @Body() dto: CreateCommentDTO,
        @CurrentUser() user: JwtPayload
    ) {
        return await this.commentService.create(dto, user.id);
    }
}
