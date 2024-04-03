import { notificationsService } from '../notifications/notificationService';
import { authHost, host } from './axios';

class BrandService {
    async getBrands() {
        try {
            const { data } = await host.get(`/product-ms/brand`);
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async createBrand(name) {
        try {
            const response = await authHost.post(`/product-ms/brand`, {
                name
            });

            notificationsService.sendSuccessNotification('Бренд создан');

            return response;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }
}

export const brandService = new BrandService();
