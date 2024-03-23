import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ReviewModule } from '@review/review.module';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    forwardRef(() => ReviewModule),
    UserModule
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule { }
