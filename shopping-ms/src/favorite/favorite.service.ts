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
    ) { }

    async toggle({ productId }: ToggleFavoriteDto, userId: string) {
        const existedFavorite = await this.favoriteModel.findOne({
            where: { productId, userId }
        });

        if (existedFavorite) {
            await existedFavorite.destroy();

            return { favorite: existedFavorite };
        }

        await this.productService.findById(productId);

        const createdFavorite = await this.favoriteModel.create({ productId, userId });

        return { favorite: createdFavorite };
    }

    async findAll(userId: string) {
        const favorites = await this.favoriteModel.findAll({
            where: { userId }
        });

        return { favorites };
    }
}
