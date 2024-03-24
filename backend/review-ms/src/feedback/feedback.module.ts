import { Module, forwardRef } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { ReviewModule } from '@review/review.module';

@Module({
  imports: [
    forwardRef(() => ReviewModule),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule { }
