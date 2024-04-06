import { notificationsService } from '../notifications/notificationService';
import { authHost } from './axios';

class UserService {
    async sendVerifyCode() {
        try {
            await authHost.get(`/user-ms/send-verify-code`);
            notificationsService.sendSuccessNotification(
                'Код верификации выслан'
            );
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async getAddresses() {
        try {
            const { data } = await authHost.get(`/user-ms/address`);
            return data.address;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async createAddresses(dto) {
        try {
            const { data } = await authHost.post(`/user-ms/address`, {
                ...dto
            });

            notificationsService.sendSuccessNotification("Адрес добавлен");

            return data.address;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async deleteAddresses(addressId) {
        try {
            const { status } = await authHost.delete(`/user-ms/address/${addressId}`);

            notificationsService.sendSuccessNotification("Адрес удален");

            return status == 200;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }
}

export const userService = new UserService();
