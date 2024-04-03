import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as proxy from 'express-http-proxy';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        credentials: true,
        origin: ['http://localhost:3000']
    });

    const configService = app.get(ConfigService);

    app.use('/api/v1/user-ms', proxy(configService.get('USER_MS_URL')));
    app.use('/api/v1/product-ms', proxy(configService.get('PRODUCT_MS_URL')));
    app.use('/api/v1/review-ms', proxy(configService.get('REVIEW_MS_URL')));
    app.use('/api/v1/shopping-ms', proxy(configService.get('SHOPPING_MS_URL')));

    await app.listen(8080);
}
bootstrap();
