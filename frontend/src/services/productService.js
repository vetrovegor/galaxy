import { notificationsService } from "../notifications/notificationService";
import { host } from "./axios";

class ProductService {
    async getProducts(page = 1, limit = 9) {
        try {
            const { data } = await host.get(`/product-ms/product`, {
                params: {page, limit}
            });
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(error.response.data.message);
        }
    }

    async getProductById(productId) {
        try {
            const { data } = await host.get(`/product-ms/product/${productId}`);
            return data.product;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(error.response.data.message);
        }
    }
}

export const productService = new ProductService();