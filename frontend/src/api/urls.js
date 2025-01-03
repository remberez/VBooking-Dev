import axios from "axios";

export const BACKEND_URL = "http://localhost:8000/api";

const $api = axios.create({
    withCredentials: true,
    baseURL: BACKEND_URL,
});

$api.interceptors.request.use( config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access')}`;
    return config;
})

export default $api;