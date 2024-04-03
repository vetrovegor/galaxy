import { notificationsService } from '../notifications/notificationService';
import { authHost, host } from './axios';

class ReviewService {
    async getProductReviewImages(productId) {
        try {
            const { data } = await host.get(
                `/review-ms/product/${productId}/image`
            );
            return data.images;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async getProductReviews(productId, page = 1, limit = 5) {
        try {
            const { data } = await host.get(
                `/review-ms/product/${productId}/review`,
                {
                    params: { page, limit }
                }
            );
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async getReviewComments(reviewId, page = 1, limit = 5) {
        try {
            const { data } = await host.get(
                `/review-ms/review/${reviewId}/comment`,
                {
                    params: { page, limit }
                }
            );
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async writeComment(reviewId, comment) {
        try {
            const { status } = await authHost.post(`/review-ms/comment`, {
                reviewId,
                comment
            });

            notificationsService.sendSuccessNotification(
                'Комментарий оставлен!'
            );

            return status;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }
}

export const reviewService = new ReviewService();
