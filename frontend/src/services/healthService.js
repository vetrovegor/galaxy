import { host } from './axios';

class HealthService {
    async checkHealth() {
        try {
            const { status } = await host.get('/health');
            return status;
        } catch (error) {
            console.log(error);
        }
    }
}

export const healthService = new HealthService();
