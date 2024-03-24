import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ReviewModule } from '@review/review.module';

@Module({
  imports: [ReviewModule],
  controllers: [ProductController]
})
export class ProductModule { }
