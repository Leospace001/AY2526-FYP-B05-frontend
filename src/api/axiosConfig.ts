import axios from 'axios';
// Explicitly tell Vite this is a type so it doesn't look for it in the compiled JS
import type { InternalAxiosRequestConfig } from 'axios'; 

const api = axios.create({
    baseURL: 'http://localhost:8080', // Adjust to match your Spring Boot URL
});

// Request Interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
    }
    return Promise.reject(error);
});

export default api;