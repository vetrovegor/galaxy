import { notificationsService } from "../notifications/notificationService";
import { host } from "./axios";

class BrandService {
    async getBrands() {
        try {
            const { data } = await host.get(`/product-ms/brand`);
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(error.response.data.message);
        }
    }
}

export const brandService = new BrandService();