import { notificationsService } from '../notifications/notificationService';
import { host } from './axios';

class TypeService {
    async getTypes() {
        try {
            const { data } = await host.get(`/product-ms/type`);
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async getTypeCharacteristics(typeId) {
        try {
            const { data } = await host.get(
                `/product-ms/type/${typeId}/characteristic`
            );
            return data.characteristics;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }
}

export const typeService = new TypeService();
