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
})