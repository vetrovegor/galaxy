import { Module, forwardRef } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FileModule } from '@file/file.module';
import { CommentModule } from '@comment/comment.module';

@Module({
  imports: [
    FileModule,
    forwardRef(() => CommentModule),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RNQ_URL')}`],
            queue: 'product-queue',
            queueOptions: { durable: false }
          }
        }),
        inject: [ConfigService]
      },
      {
        name: 'USER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RNQ_URL')}`],
            queue: 'user-queue',
            queueOptions: { durable: false }
          }
        }),
        inject: [ConfigService]
      }
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule { }
