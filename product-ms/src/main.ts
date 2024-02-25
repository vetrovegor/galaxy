import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // попробовать убрать transform
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // попробовать убрать
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);

  await app.listen(configService.get("PORT"));
}
bootstrap();
