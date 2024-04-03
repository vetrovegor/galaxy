import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorite } from './favorite.entity';
import { ProductModule } from '@product/product.module';

@Module({
    imports: [SequelizeModule.forFeature([Favorite]), ProductModule],
    controllers: [FavoriteController],
    providers: [FavoriteService]
})
export class FavoriteModule {}
