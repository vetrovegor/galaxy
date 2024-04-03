import { Injectable } from '@nestjs/common';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Favorite } from './favorite.entity';
import { ProductService } from '@product/product.service';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectModel(Favorite) private readonly favoriteModel: typeof Favorite,
        private readonly productService: ProductService
    ) {}

    async toggle({ productId }: ToggleFavoriteDto, userId: string) {
        const existedFavorite = await this.favoriteModel.findOne({
            where: { productId, userId }
        });

        if (existedFavorite) {
            await existedFavorite.destroy();

            return { message: 'Товар удален из избранного' };
        }

        await this.productService.findById(productId);

        await this.favoriteModel.create({ productId, userId });

        return { message: 'Товар добавлен в избранное' };
    }

    async findAll(userId: string) {
        const favorites = await this.favoriteModel.findAll({
            where: { userId }
        });

        const products = await Promise.all(
            favorites.map(async ({ productId }) => {
                return await this.productService.findById(productId);
            })
        );

        return { products };
    }

    async findIds(userId: string) {
        const favorites = await this.favoriteModel.findAll({
            where: { userId }
        });

        return favorites.map((item) => item.productId);
    }
}
