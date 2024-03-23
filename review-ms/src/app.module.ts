import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import * as path from 'path'
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { FileModule } from './file/file.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CommentModule } from './comment/comment.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static'),
    }),
    PrismaModule,
    ReviewModule,
    ProductModule,
    AuthModule,
    FileModule,
    FeedbackModule,
    CommentModule,
    RabbitMqModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule { }
