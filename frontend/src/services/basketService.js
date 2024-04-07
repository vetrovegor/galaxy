import { notificationsService } from '../notifications/notificationService';
import { authHost } from './axios';

class BasketService {
    async addProduct(productId, quantity = 1) {
        try {
            const { status } = await authHost.post('/shopping-ms/basket', {
                productId,
                quantity
            });

            const success = status == 201;

            if (success) {
                notificationsService.sendSuccessNotification(
                    'Товар добавлен в корзину'
                );
            }

            return success;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(error.message);
        }
    }

    async removeProduct(productId) {
        try {
            const { status } = await authHost.delete(
                `/shopping-ms/basket/${productId}`
            );

            const success = status == 200;

            if (success) {
                notificationsService.sendSuccessNotification(
                    'Товар удален из корзины'
                );
            }

            return success;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(error.message);
        }
    }
}

export const basketService = new BasketService();
