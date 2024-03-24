import { notificationsService } from "../notifications/notificationService";
import { authHost } from "./axios";

class UserService {
    async sendVerifyCode() {
        try {
            await authHost.get(`/user-ms/send-verify-code`);
            notificationsService.sendSuccessNotification('Код верификации выслан');
        } catch (error) {
            notificationsService.sendErrorResponseNotification(error.response.data.message);
        }
    }
}

export const userService = new UserService();