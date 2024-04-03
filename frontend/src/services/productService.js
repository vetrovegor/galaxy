import { notificationsService } from '../notifications/notificationService';
import { authHost, host } from './axios';

class ProductService {
    async getProducts(page, limit, type, brand) {
        try {
            const { data } = await host.get(`/product-ms/product`, {
                params: { page, limit, type, brand }
            });
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async getProductById(productId) {
        try {
            const { data } = await host.get(`/product-ms/product/${productId}`);
            return data.product;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async createProduct(dto) {
        try {
            await authHost.post('/product-ms/product', dto);
            notificationsService.sendSuccessNotification('Товар создан');
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }
}

export const productService = new ProductService();
