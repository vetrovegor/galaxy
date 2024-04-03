import { notificationsService } from '../notifications/notificationService';
import { authHost } from './axios';

class FavoriteService {
    async getFavorites() {
        try {
            const { data } = await authHost.get('/shopping-ms/favorite');
            return data.products;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(error.message);
        }
    }

    async toggle(productId) {
        try {
            const response = await authHost.post('/shopping-ms/favorite', {
                productId
            });

            notificationsService.sendSuccessNotification(response.data.message);

            return response.status == 201;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                'Произошла ошибка при добавлении товара в избранное'
            );
        }
    }
}

export const favoriteService = new FavoriteService();
