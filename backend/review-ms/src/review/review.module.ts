import { Module, forwardRef } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FileModule } from '@file/file.module';
import { CommentModule } from '@comment/comment.module';
import { FeedbackModule } from '@feedback/feedback.module';
import { UserModule } from '@user/user.module';

@Module({
    imports: [
        FileModule,
        forwardRef(() => CommentModule),
        forwardRef(() => FeedbackModule),
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
            }
        ]),
        UserModule
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService]
})
export class ReviewModule {}
