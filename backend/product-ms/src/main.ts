import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
        .setTitle('Produtcs API')
        .setDescription('The products API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

  // попробовать убрать transform
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // попробовать убрать
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`${configService.get('RNQ_URL')}`],
      queue: 'product-queue',
      queueOptions: { durable: false }
    }
  });

  await app.startAllMicroservices();
  await app.listen(configService.get("PORT"));
}
bootstrap();
