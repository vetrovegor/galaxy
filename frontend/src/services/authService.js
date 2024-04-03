import { notificationsService } from '../notifications/notificationService';
import { authHost, host } from './axios';

class AuthService {
    async register(nickname, email, password) {
        try {
            const { data } = await host.post(`/user-ms/auth/register`, {
                nickname,
                email,
                password
            });

            notificationsService.sendSuccessNotification(
                'Вы успешно зарегистрировались! Вам на почту отправлена ссылка для подтверждения аккаунта'
            );

            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async login(nickname, password, onError) {
        try {
            const { data } = await host.post(`/user-ms/auth/login`, {
                nickname,
                password
            });

            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async logout() {
        try {
            const { data } = await host.get(`/user-ms/auth/logout`);
            return data;
        } catch (error) {
            notificationsService.sendErrorResponseNotification(
                error.response.data.message
            );
        }
    }

    async getUserShortInfo() {
        try {
            const { data } = await authHost.get(`/user-ms/me`);
            return data;
        } catch (error) {
            console.log(error.response.data.message);
        }
    }
}

export const authService = new AuthService();
