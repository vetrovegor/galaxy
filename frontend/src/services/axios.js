import axios from "axios";

axios.defaults.withCredentials = true;

export const host = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
});

export const authHost = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    }
});

authHost.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const status = error.response.status;

        if (status === 401 || status === 403) {
            if (!originalRequest.url.includes('refresh')) {
                console.log('Пришел 401/403 status code');
                originalRequest._retry = true;
                try {
                    const { data } = await authHost.get('/user-ms/auth/refresh');
                    const { accessToken } = data;
                    console.log('Пришел новый токен', accessToken);
                    localStorage.setItem('accessToken', accessToken);
                    originalRequest.headers.Authorization = 'Bearer ' + accessToken;
                    return authHost(originalRequest);
                } catch (error) {
                    throw error;
                }
            } else {
                console.log('Не прошел refresh, очищаем localStorage');
                console.log({ status, url: originalRequest.url });
                localStorage.removeItem('accessToken');
            }
        }

        return Promise.reject(error);
    }
);